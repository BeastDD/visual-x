// auth.ts
import NextAuth from "next-auth"
import Twitter from "next-auth/providers/twitter"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
      authorization: {
        params: {
          scope: "users.read tweet.read offline.access",
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.providerAccountId = profile?.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.providerAccountId as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})