import { Inject, Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { first, tap } from 'rxjs/operators'
import { APP_PREFERENCES_LOCAL } from '../../preferences/preferences-providers'
import { LocalPreferences, PreferencesService } from '../../preferences/services/preferences.service'
import { Themes } from '../enums/themes.enum'
import { InitializationService } from './initialization.service'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme$: Subject<Themes> = new BehaviorSubject(Themes.DARK);

  constructor(@Inject(APP_PREFERENCES_LOCAL) private preferencesService: PreferencesService<LocalPreferences>,
              private initializationService: InitializationService) {
    this.initializationService.register(
      this.preferencesService.preferences.pipe(
        first(),
        tap((preferences) => {
          this.theme$.next(preferences.theme)
        })
      )
    )
  }

  whenThemeChanges(): Observable<Themes> {
    return this.theme$.asObservable()
  }

  changeTheme(theme: Themes) {
    this.preferencesService.preferences
      .pipe(
        first()
      )
      .subscribe(preferences => {
        preferences.theme = theme

        this.preferencesService.save(preferences)
        this.theme$.next(theme)
      })
  }
}
