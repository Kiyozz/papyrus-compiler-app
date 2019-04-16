import { Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class WindowControlsService {
  private maximize$: Subject<boolean> = new Subject<boolean>()

  constructor(private electronService: ElectronService) {
    this.currentWindow.on('maximize', () => {
      this.maximize$.next(this.currentWindow.isMaximized())
    })

    this.currentWindow.on('unmaximize', () => {
      this.maximize$.next(this.currentWindow.isMaximized())
    })
  }

  whenMaximizeChanges() {
    return this.maximize$.asObservable()
  }

  minimize() {
    this.currentWindow.minimize()
  }

  toggleRestoreMaximize() {
    if (this.currentWindow.isMaximized()) {
      this.currentWindow.unmaximize()
      this.maximize$.next(false)
    } else {
      this.currentWindow.maximize()
      this.maximize$.next(true)
    }
  }

  close() {
    this.currentWindow.close()
  }

  get currentWindow() {
    return this.electronService.remote.getCurrentWindow()
  }
}
