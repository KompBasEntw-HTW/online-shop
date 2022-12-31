import NextAuth, { User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import KeycloakProvider from 'next-auth/providers/keycloak'

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(
      'http://keycloak:8080/management/keycloak/realms/exe/protocol/openid-connect/token',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_NEXTAUTH_CLIENT_ID as string,
          client_secret: process.env.KEYCLOAK_NEXTAUTH_CLIENT_SECRET as string,
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken as string
        })
      }
    )

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export default NextAuth({
  session: {
    maxAge: 24 * 60 * 60 // 1 day
  },
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_NEXTAUTH_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_NEXTAUTH_CLIENT_SECRET as string,
      issuer: 'http://keycloak:8080/management/keycloak/realms/exe'
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        if (account.expires_at) {
          return {
            accessToken: account.access_token,
            accessTokenExpires: account.expires_at * 1000,
            refreshToken: account.refresh_token,
            user
          }
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user as User
      session.accessToken = token.accessToken as string
      session.error = token.error as string

      return session
    }
  }
})
