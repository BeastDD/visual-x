import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
      version: "2.0", // Use OAuth 2.0 for modern X/Twitter API
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.handle = profile.data?.username || profile.screen_name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.handle = token.handle as string
        // @ts-ignore
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }