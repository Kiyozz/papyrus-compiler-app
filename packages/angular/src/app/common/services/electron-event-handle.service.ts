import { Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { from, Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ElectronEventHandleService {

  constructor(private electronService: ElectronService) {
  }

  handle<T = any>(eventName: string, ...args: any[]): Observable<T> {
    const promise = new Promise<T>((resolve, reject) => {
      this.electronService.ipcRenderer.send(eventName, ...args)
      this.electronService.ipcRenderer.once(`${eventName}-done`, (event, payload) => {
        if (payload.hasOwnProperty('error')) {
          reject(payload.error)
        }

        resolve(payload)
      })
    })

    return from(promise)
  }

  handleProgress(eventName: string, ...args: any[]): Observable<number> {
    const subject = new Subject<number>()

    const progressListener = (event, payload) => {
      if (payload.hasOwnProperty('error')) {
        subject.next(100)
        subject.complete()
        this.electronService.ipcRenderer.removeListener(`${eventName}-progress`, progressListener)
      }

      subject.next(payload)

      if (payload >= 100) {
        subject.complete()
        this.electronService.ipcRenderer.removeListener(`${eventName}-progress`, progressListener)
      }
    }

    console.log('register event')
    this.electronService.ipcRenderer.on(`${eventName}-progress`, progressListener)

    return subject.asObservable()
  }
}
