/*
 * 2026 Kiyozz.
 */

import { AppSidebar } from '@renderer/components/app-sidebar.tsx'
import DialogSetup from '@renderer/components/dialog/dialog-setup.tsx'
import { Titlebar } from '@renderer/components/titlebar.tsx'
import { Separator } from '@renderer/components/ui/separator.tsx'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@renderer/components/ui/sidebar.tsx'
import type { PropsWithChildren } from 'react'
import { Outlet } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbList,
} from '@renderer/components/ui/breadcrumb.tsx'
import useLocalStorage from 'react-use-localstorage'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar-open', 'true')

  return (
    <>
      <Titlebar />
      <DialogSetup />
      <SidebarProvider
        open={sidebarOpen === 'true'}
        onOpenChange={(open) => setSidebarOpen(open.toString())}
      >
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
    <header className="drag flex justify-between h-(--sidebar-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {children}
    </header>
  )
}

export function LayoutHeaderTitle({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-1 items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-center"
      />
      <Breadcrumb>
        <BreadcrumbList>{children}</BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export function LayoutHeaderActions({ children }: PropsWithChildren) {
  return (
    <div className="ml-auto px-3 flex items-center gap-2 text-sm">
      {children}
    </div>
  )
}
