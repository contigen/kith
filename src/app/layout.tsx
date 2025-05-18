import type React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Navbar } from '@/components/navbar'
import { MobileNav } from '@/components/mobile-nav'
import { Toaster } from '@/components/ui/sonner'
import { Pixelify_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixelify',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'kith | AI Agent Passport',
  description: 'A decentralised trust layer for AI agents',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn('antialiased', pixelify.variable)}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <div className='flex flex-col min-h-screen'>
            <SessionProvider session={session}>
              <Navbar />
              <main className='flex-1'>{children}</main>
              <MobileNav />
            </SessionProvider>
          </div>
          <Toaster duration={3000} closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
