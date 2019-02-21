import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private electronService: ElectronService) { }

  open(options: Electron.OpenDialogOptions): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        this.electronService.remote.dialog.showOpenDialog(options, (value) => {
          if (value !== undefined) {
            resolve(value);
          } else {
            resolve([]);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
