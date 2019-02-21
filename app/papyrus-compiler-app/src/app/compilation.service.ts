import { Inject, Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION } from './app-providers';
import {
  ALWAYS_COMPILE_SCRIPTS,
  FLAG,
  GAME_PATH_FOLDER,
  IMPORTS_FOLDER,
  OUTPUT_FOLDER,
  SCRIPTS
} from './preferences-keys';
import { PreferencesService } from './preferences.service';
import { getScriptsFromString, uniqueArray } from './utils/utils';
import { OutputLogsService } from './output-logs.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompilationService {
  private _compilingScript: Subject<string> = new BehaviorSubject<string>('');
  compilingScript = this._compilingScript.asObservable();

  constructor(@Inject(APP_PREFERENCES_LOCAL) private readonly preferencesService: PreferencesService,
              @Inject(APP_PREFERENCES_SESSION) private readonly preferencesSessionService: PreferencesService,
              private electronService: ElectronService,
              private logsService: OutputLogsService) {
  }

  async compile(script: string): Promise<void> {
    this._compilingScript.next(script);

    const {
      flag,
      importsFolder,
      gamePathFolder,
      outputFolder
    } = await this.preferencesService.getAll([OUTPUT_FOLDER, IMPORTS_FOLDER, FLAG, GAME_PATH_FOLDER]);

    this.logsService.add(`<h1>${script}</h1>`);

    this.electronService.ipcRenderer.send('compile-script', {
      script,
      output: outputFolder,
      imports: importsFolder,
      flag,
      gamePath: gamePathFolder
    });

    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.once('compile-failed', (event, output) => {
        this.logsService.add(`<p class="app-logs-info"><span class="app-logs-error">${output}</span></p>`);
        console.log('error ' + script);
        console.log('output ====== ' + output);
        reject(output);

        this.doneCompilingScript();
      });

      this.electronService.ipcRenderer.once('compile-success', (event, output) => {
        console.log('success ' + script);
        console.log('output ===== ' + output);
        this.logsService.add(`\n<p class="app-logs-info">${output}</p>`);
        this.doneCompilingScript();

        resolve();
      });
    });
  }

  private doneCompilingScript() {
    this._compilingScript.next('');
    this.electronService.ipcRenderer.removeAllListeners('compile-failed');
    this.electronService.ipcRenderer.removeAllListeners('compile-success');
  }

  async getAllScripts(): Promise<string[]> {
    const scriptsFromString = await this.preferencesSessionService.get(SCRIPTS);
    const alwaysScripts = await this.preferencesService.get(ALWAYS_COMPILE_SCRIPTS);

    return uniqueArray([...getScriptsFromString(scriptsFromString), ...getScriptsFromString(alwaysScripts)]);
  }
}
