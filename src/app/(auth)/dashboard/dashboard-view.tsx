'use client'

import Sidebar from '@/components/sidebar'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function DashboardView({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <>
      <Sidebar {...{ isSidebarCollapsed, setSidebarCollapsed }} />
      <main
        className={cn(
          'flex-1 p-4 md:p-6 transition-all duration-300',
          isSidebarCollapsed ? 'md:ml-[70px]' : 'md:ml-64'
        )}
      >
        {children}
      </main>
    </>
  )
}
