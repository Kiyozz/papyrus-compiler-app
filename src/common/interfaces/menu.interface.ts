import { MenuItemConstructorOptions } from 'electron'

export interface MenuInterface {
  name: string
  submenu?: MenuInterface[]
  event?: string
  type?: MenuItemConstructorOptions['type']
  role?: MenuItemConstructorOptions['role']
}
