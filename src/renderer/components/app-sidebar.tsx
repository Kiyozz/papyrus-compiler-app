/*
 * 2026 Kiyozz.
 */

import { bridge } from '@renderer/bridge.ts'
import { DialogCompilationLogs } from '@renderer/components/dialog/dialog-compilation-logs.tsx'
import { DialogDocumentation } from '@renderer/components/dialog/dialog-documentation.tsx'
import { AppLogoIcon } from '@renderer/components/icons/app-logo-icon.tsx'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@renderer/components/ui/sidebar.tsx'
import {
  BookIcon,
  BoxesIcon,
  ChevronsUpDownIcon,
  ComputerIcon,
  FileClockIcon,
  SettingsIcon,
} from 'lucide-react'
import type { ComponentProps, MouseEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { t } from '@lingui/core/macro'

const mainItems = [
  {
    icon: ComputerIcon,
    text: t`Compilation`,
    href: '/compilation',
  },
  {
    icon: BoxesIcon,
    text: t`Groupes`,
    href: '/groups',
  },
  {
    icon: SettingsIcon,
    text: t`Paramètres`,
    href: '/settings',
  },
] as const

const miscItems = [
  {
    icon: FileClockIcon,
    text: t`Logs`,
    dialog: DialogCompilationLogs,
  },
  {
    icon: BookIcon,
    text: t`Documentation`,
    dialog: DialogDocumentation,
  },
] as const

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const handleClickMenu = (evt: MouseEvent) => {
    void bridge.titlebar.openMenu({ x: evt.pageX, y: evt.pageY })
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="transition-[padding,width] duration-200 ease-linear group-data-[collapsible=icon]:h-auto! group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:rounded-sm group-data-[collapsible=icon]:p-2!"
              onClick={handleClickMenu}
            >
              <div className="flex aspect-square rounded-lg">
                <AppLogoIcon className="size-8 p-0.5" />
              </div>
              <div className="flex-1 truncate font-mono text-lg">2025.1</div>
              <ChevronsUpDownIcon className="size-4 truncate" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.text}>
                <SidebarMenuButton
                  tooltip={item.text}
                  render={
                    <Link
                      to={item.href}
                      className="data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
                    />
                  }
                >
                  <item.icon />
                  <span>{item.text}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarGroup>
          <SidebarMenu>
            {miscItems.map((item) => (
              <SidebarMenuItem key={item.text}>
                {/* the dialog trigger has to land on the button, not on the
                    <li> around it: it is what carries the click and the
                    aria-haspopup wiring */}
                <item.dialog>
                  <SidebarMenuButton tooltip={item.text}>
                    <item.icon />
                    <span>{item.text}</span>
                  </SidebarMenuButton>
                </item.dialog>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
