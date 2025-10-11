import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Removed PrismaAdapter - it conflicts with JWT sessions
  // We'll manually manage users in the signIn callback
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Removed allowDangerousEmailAccountLinking - security risk
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // Removed allowDangerousEmailAccountLinking - security risk
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user || !user.password) {
          return null
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in - store user info in token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      
      // Store provider info for reference
      if (account) {
        token.provider = account.provider
      }
      
      return token
    },
    
    async session({ session, token }) {
      // Add user info to session from JWT token
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
    
    async signIn({ user, account, profile }) {
      try {
        // For OAuth providers, manually create/update user in database
        if (account?.provider === "google" || account?.provider === "github") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
          if (!existingUser) {
            // Create new user
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                image: user.image,
                emailVerified: new Date(),
              }
            })
            
            // Update user object with our database ID
            user.id = newUser.id
          } else {
            // Update existing user's info
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                emailVerified: new Date(),
              }
            })
            
            user.id = existingUser.id
          }
        }
        
        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return false
      }
    },
    
    async redirect({ url, baseUrl }) {
      // If the URL is relative (starts with /), allow it
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // If the URL is on the same origin, allow it
      else if (new URL(url).origin === baseUrl) {
        return url
      }
      // Default to dashboard
      return `${baseUrl}/dashboard`
    },
  },
  session: {
    // Use JWT for credentials, database for OAuth
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
})
