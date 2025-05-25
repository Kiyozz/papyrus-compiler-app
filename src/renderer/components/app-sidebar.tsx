import { bridge } from '@/bridge.ts'
import { DialogCompilationLogs } from '@/components/dialog/dialog-compilation-logs.tsx'
import { DialogDocumentation } from '@/components/dialog/dialog-documentation.tsx'
import { AppLogoIcon } from '@/components/icons/app-logo-icon.tsx'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar.tsx'
import { BookIcon, BoxesIcon, ChevronsUpDownIcon, ComputerIcon, FileClockIcon, SettingsIcon } from 'lucide-react'
import type { ComponentProps, MouseEvent } from 'react'
import { NavLink } from 'react-router'

const mainItems = [
  {
    icon: ComputerIcon,
    text: 'Compilation',
    href: '/compilation',
  },
  {
    icon: BoxesIcon,
    text: 'Groups',
    href: '/groups',
  },
  {
    icon: SettingsIcon,
    text: 'Settings',
    href: '/settings',
  },
] as const

const miscItems = [
  {
    icon: FileClockIcon,
    text: 'Logs',
    dialog: DialogCompilationLogs,
  },
  {
    icon: BookIcon,
    text: 'Documentation',
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
              className="transition-[padding,width] duration-200 ease-linear group-data-[collapsible=icon]:h-auto! group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:rounded-none group-data-[collapsible=icon]:p-2!"
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
                <SidebarMenuButton tooltip={item.text} asChild>
                  <NavLink
                    to={item.href}
                    className="aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
                  >
                    <item.icon />
                    <span>{item.text}</span>
                  </NavLink>
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
              <item.dialog key={item.text}>
                <SidebarMenuItem key={item.text}>
                  <SidebarMenuButton tooltip={item.text}>
                    <item.icon />
                    <span>{item.text}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </item.dialog>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
