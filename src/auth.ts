import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    walletAddress?: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      walletAddress?: string
    } & DefaultSession['user']
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        walletAddress: {},
      },
      async authorize(credentials) {
        const { walletAddress } = credentials || {}
        if (!walletAddress) return null
        return {
          id: crypto.randomUUID(),
          walletAddress: walletAddress as string,
        }
      },
    }),
  ],
  callbacks: {
    // async authorized({ request: req, auth }) {
    //   const PUBLIC_ROUTES = [`/`, `/connect`]
    //   const { pathname } = req.nextUrl
    //   const isLoggedIn = !!auth?.user
    //   const isAPublicRoute = PUBLIC_ROUTES.some(route => route === pathname)
    //   if (isLoggedIn && isAPublicRoute) {
    //     return NextResponse.redirect(new URL(`/dashboard`, req.url))
    //   }
    //   if (isAPublicRoute) {
    //     return true
    //   }
    //   return isLoggedIn
    // },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token = { ...token, ...user }
      }
      if (trigger === `update` && session) {
        token = {
          ...token,
          walletAddress: session.user?.walletAddress,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          walletAddress: token.walletAddress,
        },
      }
    },
  },
  pages: {
    signIn: `/connect`,
    newUser: `/dashboard`,
    signOut: `/`,
    error: `/connect`,
  },
})
