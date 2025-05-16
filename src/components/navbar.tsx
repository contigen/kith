'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Search, Check, Copy, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Registry', href: '/registry' },
  { name: 'Verify', href: '/verify' },
  { name: 'Issue', href: '/issue' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isConnected, setIsConnected] = useState(false)
  const [walletType, setWalletType] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [copied, setCopied] = useState(false)

  // Check if user already has a connected wallet
  useEffect(() => {
    // This would typically check local storage or a session
    const savedWallet = localStorage.getItem('connectedWallet')
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet)
        setWalletAddress(walletData.address)
        setWalletType(walletData.type)
        setIsConnected(true)
      } catch (e) {
        localStorage.removeItem('connectedWallet')
      }
    }
  }, [])

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletType('')
    setWalletAddress('')
    localStorage.removeItem('connectedWallet')

    toast('Wallet Disconnected', {
      description: 'Your DID wallet has been disconnected.',
    })
  }

  const copyToClipboard = () => {
    if (navigator.clipboard && walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast('DID Copied', {
        description: 'DID has been copied to clipboard.',
      })
    }
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex items-center justify-between h-16'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='text-xl font-bold'>kith</span>
          </Link>
          <nav className='hidden gap-6 md:flex'>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' className='hidden md:flex'>
            <Search className='w-4 h-4' />
            <span className='sr-only'>Search</span>
          </Button>
          <ThemeToggle />

          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='flex items-center gap-2'>
                  <Avatar className='w-6 h-6'>
                    <AvatarFallback className='text-xs bg-primary text-primary-foreground'>
                      {walletType.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className='hidden md:inline-block'>
                    {walletAddress.substring(0, 8)}...
                    {walletAddress.substring(walletAddress.length - 4)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Your DID Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='flex justify-between'
                  onClick={copyToClipboard}
                >
                  <span className='truncate max-w-[200px]'>
                    {walletAddress}
                  </span>
                  {copied ? (
                    <Check className='w-4 h-4 ml-2' />
                  ) : (
                    <Copy className='w-4 h-4 ml-2' />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>
                  <LogOut className='w-4 h-4 mr-2' />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className='hidden md:inline-flex' asChild>
              <Link href='/connect'>Connect DID</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
