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
import type { ComponentProps, MouseEvent } from 'react'
import { AppLogoIcon } from '@/components/icons/app-logo-icon.tsx'
import { bridge } from '@/bridge.ts'
import { BookIcon, BoxesIcon, ChevronsUpDownIcon, ComputerIcon, FileClockIcon, SettingsIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

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
  },
  {
    icon: BookIcon,
    text: 'Documentation',
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
              className="transition-[padding,width,height] duration-200 ease-linear group-data-[collapsible=icon]:h-auto! group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:rounded-none group-data-[collapsible=icon]:p-2!"
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
                  <Link to={item.href}>
                    <item.icon />
                    <span>{item.text}</span>
                  </Link>
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
                <SidebarMenuButton tooltip={item.text}>
                  <item.icon />
                  <span>{item.text}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
