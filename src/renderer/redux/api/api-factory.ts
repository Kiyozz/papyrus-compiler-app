import { IpcApi } from './ipc-api'

export function apiFactory() {
  return new IpcApi()
}
