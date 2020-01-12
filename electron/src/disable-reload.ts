import { globalShortcut } from 'electron'

export function disableReload() {
  globalShortcut.register('CommandOrControl+R', () => false)
  globalShortcut.register('F5', () => false)
  globalShortcut.register('CommandOrControl+Shift+R', () => false)
}
