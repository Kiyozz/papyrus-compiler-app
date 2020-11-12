import { ipcRenderer } from '../../common/ipc'
import { IS_PRODUCTION } from '../../common/events'

export function isProduction(): Promise<boolean> {
  return ipcRenderer.invoke(IS_PRODUCTION)
}
