'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Search, Shield, FileCheck, User } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Registry', href: '/registry', icon: Search },
  { name: 'Verify', href: '/verify', icon: Shield },
  { name: 'Issue', href: '/issue', icon: FileCheck },
]

export function MobileNav() {
  const pathname = usePathname()
  const [isConnected, setIsConnected] = useState(false)

  // Check if user already has a connected wallet
  useEffect(() => {
    // This would typically check local storage or a session
    const savedWallet = localStorage.getItem('connectedWallet')
    if (savedWallet) {
      setIsConnected(true)
    }
  }, [])

  return (
    <div className='fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background md:hidden'>
      <div className='grid h-full grid-cols-5'>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className='h-5 w-5' />
            <span className='text-xs mt-1'>{item.name}</span>
          </Link>
        ))}
        <Link
          href='/connect'
          className={cn(
            'flex flex-col items-center justify-center',
            pathname === '/connect' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <User className='h-5 w-5' />
          <span className='text-xs mt-1'>
            {isConnected ? 'Wallet' : 'Connect'}
          </span>
        </Link>
      </div>
    </div>
  )
}
