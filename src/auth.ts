import NextAuth from 'next-auth'
import Keycloak from 'next-auth/providers/keycloak'
export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Keycloak],
	trustHost: true,
	callbacks: {
		async jwt({ token, account }) {
			if (account?.provider === 'keycloak') {
				return { ...token, accessToken: account.access_token }
			}
			return { ...token }
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken as string
			return session
		}
	}
})
