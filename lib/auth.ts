import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ user, account, profile, isNewUser }) {
      // Send welcome email to new users
      if (isNewUser && user.email) {
        try {
          const { sendWelcomeEmail } = await import('@/lib/email')
          await sendWelcomeEmail(user.email, user.name)
        } catch (error) {
          console.error('Failed to send welcome email:', error)
          // Don't block sign-in if email fails
        }
      }
      return true
    },
  },
  session: {
    strategy: "database",
  },
  debug: process.env.NODE_ENV === "development",
})
