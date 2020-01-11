if (typeof window.require === 'undefined') {
  throw new Error('Run the app through Electron.')
}

export class IpcRenderer {
  private ipcRenderer = window.require('electron').ipcRenderer

  send<R = any, Args = any>(event: string, ...args: Args[]): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const eventSuccess = `${event}-success`
      const eventError = `${event}-error`

      const onError = (event: Electron.Event, payload: string) => {
        this.ipcRenderer.removeListener(eventSuccess, onSuccess)

        reject(payload)
      }

      const onSuccess = (event: Electron.Event, payload: R) => {
        this.ipcRenderer.removeListener(eventError, onError)

        resolve(payload)
      }

      this.ipcRenderer.once(eventSuccess, onSuccess)
      this.ipcRenderer.once(eventError, onError)
      this.ipcRenderer.send(event, ...args)
    })
  }
}
