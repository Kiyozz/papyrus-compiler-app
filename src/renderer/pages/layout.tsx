import { AppSidebar } from '@/components/app-sidebar.tsx'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Outlet } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

export function LayoutHeader({ children }: PropsWithChildren) {
  return (
    <header className="drag flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {children}
    </header>
  )
}

export function LayoutHeaderTitle({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      {children}
    </div>
  )
}
