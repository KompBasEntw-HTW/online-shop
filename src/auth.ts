import NextAuth from 'next-auth'
import Keycloak from 'next-auth/providers/keycloak'
export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Keycloak],
	trustHost: true,
	callbacks: {
		async session({ session, token }) {
			session.accessToken = token.accessToken as string
			session.error = token.error as string
			return session
		}
	}
})
