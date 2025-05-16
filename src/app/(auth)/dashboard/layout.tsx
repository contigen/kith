'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FileCheck,
  Users,
  ChevronRight,
  Menu,
  Home,
  Bell,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Close mobile sidebar when path changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const navItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Agents',
      href: '/dashboard/agents',
      icon: Users,
      badge: '3',
    },
    {
      name: 'Credentials',
      href: '/dashboard/credentials',
      icon: FileCheck,
      badge: '2',
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/30'>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 z-20 hidden md:flex flex-col border-r bg-background transition-all duration-300',
          isSidebarCollapsed ? 'w-[70px]' : 'w-64'
        )}
      >
        <div className='flex h-16 items-center border-b px-4'>
          {!isSidebarCollapsed ? (
            <Link href='/' className='flex items-center gap-2'>
              <span className='text-xl font-bold'>kith</span>
              <span className='text-sm text-muted-foreground'>dashboard</span>
            </Link>
          ) : (
            <Link href='/' className='flex items-center justify-center w-full'>
              <span className='text-xl font-bold'>k</span>
            </Link>
          )}
        </div>
        <div className='flex-1 overflow-auto py-4 bg-gradient-to-b from-background to-muted/10'>
          <nav className='grid gap-1 px-2'>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted hover:bg-opacity-70'
                )}
              >
                <item.icon className='h-4 w-4' />
                {!isSidebarCollapsed && (
                  <span className='flex-1 truncate'>{item.name}</span>
                )}
                {!isSidebarCollapsed && item.badge && (
                  <Badge variant='outline' className='ml-auto'>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className='border-t p-4'>
          <Button
            variant='ghost'
            size='icon'
            className='ml-auto'
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isSidebarCollapsed ? 'rotate-180' : ''
              )}
            />
            <span className='sr-only'>
              {isSidebarCollapsed ? 'Expand' : 'Collapse'}
            </span>
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className='md:hidden'>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-64 p-0'>
            <SheetHeader className='border-b h-16 px-4 flex items-center'>
              <SheetTitle className='flex items-center gap-2'>
                <span className='text-xl font-bold'>kith</span>
                <span className='text-sm text-muted-foreground'>dashboard</span>
              </SheetTitle>
            </SheetHeader>
            <div className='py-4 bg-gradient-to-b from-background to-muted/10 h-full'>
              <nav className='grid gap-1 px-2'>
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <item.icon className='h-4 w-4' />
                    <span className='flex-1 truncate'>{item.name}</span>
                    {item.badge && (
                      <Badge variant='outline' className='ml-auto'>
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-col transition-all duration-300',
          isSidebarCollapsed ? 'md:ml-[70px]' : 'md:ml-64'
        )}
      >
        {/* Header */}
        <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6'>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
          <div className='flex-1'>
            <nav className='hidden md:flex items-center gap-4 text-sm'>
              <Link
                href='/'
                className='flex items-center gap-1 text-muted-foreground hover:text-foreground'
              >
                <Home className='h-4 w-4' />
                <span>Home</span>
              </Link>
              <ChevronRight className='h-4 w-4 text-muted-foreground' />
              <Link
                href='/dashboard'
                className={cn(
                  'text-muted-foreground hover:text-foreground',
                  pathname === '/dashboard' ? 'text-foreground font-medium' : ''
                )}
              >
                Dashboard
              </Link>
              {pathname !== '/dashboard' && (
                <>
                  <ChevronRight className='h-4 w-4 text-muted-foreground' />
                  <span className='font-medium'>
                    {pathname.includes('/agents')
                      ? 'My Agents'
                      : pathname.includes('/credentials')
                      ? 'Credentials'
                      : pathname.includes('/settings')
                      ? 'Settings'
                      : ''}
                  </span>
                </>
              )}
            </nav>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' className='hidden md:flex'>
              <Bell className='h-4 w-4 mr-2' />
              Notifications
              <Badge className='ml-2 bg-primary text-primary-foreground'>
                3
              </Badge>
            </Button>
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Bell className='h-5 w-5' />
              <Badge className='absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]'>
                3
              </Badge>
            </Button>

            <Button variant='secondary'>Logout</Button>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 p-4 md:p-6'>{children}</main>
      </div>
    </div>
  )
}
