import IpcApi from './ipc-api'

export default function apiFactory() {
  return new IpcApi()
}
