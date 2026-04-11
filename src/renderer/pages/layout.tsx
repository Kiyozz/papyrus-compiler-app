import { AppSidebar } from '@renderer/components/app-sidebar.tsx'
import { Titlebar } from '@renderer/components/titlebar.tsx'
import { Separator } from '@renderer/components/ui/separator.tsx'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@renderer/components/ui/sidebar.tsx'
import type { PropsWithChildren } from 'react'
import { Outlet } from 'react-router'

export function Layout() {
  return (
    <>
      <Titlebar />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export function LayoutHeader({ children }: PropsWithChildren) {
  return (
    <header className="drag flex h-(--sidebar-height) shrink-0 items-center justify-between px-4 transition-[width] ease-linear">
      {children}
    </header>
  )
}

export function LayoutHeaderTitle({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      {children}
    </div>
  )
}
