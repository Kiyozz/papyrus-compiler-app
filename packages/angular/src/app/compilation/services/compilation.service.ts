import { Inject, Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { ElectronEventHandleService } from '../../common/services/electron-event-handle.service'
import { OutputLogsService } from '../../output/services/output-logs.service'
import { APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION } from '../../preferences/preferences-providers'
import {
  LocalPreferences,
  PreferencesService,
  SessionPreferences
} from '../../preferences/services/preferences.service'

@Injectable({
  providedIn: 'root'
})
export class CompilationService {
  private compilingScript$: Subject<string> = new BehaviorSubject<string>('')
  private localPreferences: LocalPreferences
  private sessionPreferences: SessionPreferences

  constructor(@Inject(APP_PREFERENCES_LOCAL) private readonly preferencesService: PreferencesService<LocalPreferences>,
              @Inject(APP_PREFERENCES_SESSION) private readonly preferencesSessionService: PreferencesService<SessionPreferences>,
              private electronService: ElectronService,
              private logsService: OutputLogsService,
              private electronEventHandleService: ElectronEventHandleService) {
    this.preferencesService.preferences.subscribe(preferences => this.localPreferences = preferences)
    this.preferencesSessionService.preferences.subscribe(preferences => this.sessionPreferences = preferences)
  }

  async compile(script: string): Promise<void> {
    this.compilingScript$.next(script)

    const { outputFolder, importsFolder, flag, gamePathFolder } = this.localPreferences

    this.logsService.add(`<h1>${script}</h1>`)

    try {
      const output = await this.electronEventHandleService.handle<{ success?: string }>('compile-script', {
        script,
        output: outputFolder,
        imports: importsFolder,
        flag,
        gamePath: gamePathFolder
      }).toPromise()

      console.log('Compile success for', script)
      console.log(`Output is ${output.success}`)
      this.logsService.add(`\n<p class="app-logs-info">${output.success}</p>`)
      this.compilingScript$.next('')
    } catch (err) {
      console.log(`Compile failed for ${script}`)
      console.log('Output is', err)
      this.logsService.add(`\n<p class="app-logs-error">${err}</p>`)
      this.compilingScript$.next('')

      throw err
    }
  }

  public whenCompilingScriptChanges(): Observable<string> {
    return this.compilingScript$.asObservable()
  }

  private doneCompilingScript() {
    this.compilingScript$.next('')
  }
}
