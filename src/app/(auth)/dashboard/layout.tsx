import type { ReactNode } from 'react'
import { DashboardView } from './dashboard-view'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/30'>
      <DashboardView>{children}</DashboardView>
    </div>
  )
}
