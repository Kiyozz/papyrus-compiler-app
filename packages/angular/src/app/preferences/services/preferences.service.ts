import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs'
import { first, switchMap, tap } from 'rxjs/operators'
import { Themes } from '../../common/enums/themes.enum'
import { Group } from '../../groups/models/group';

export interface LocalPreferences {
  outputFolder: string;
  importsFolder: string;
  gamePathFolder: string;
  flag: string;
  groups: Group[];
  theme: Themes
}

export interface SessionPreferences {
  group: number;
}

@Injectable()
export class PreferencesService<T = LocalPreferences | SessionPreferences> {
  private _preferences: Subject<T> = new BehaviorSubject<T>(null);
  preferences = this._preferences.asObservable();

  constructor(private storage: LocalForage, private defaultPreferences: T) {
  }

  save(newestPreferences: T): void {
    this.storage.setItem<T>('preferences', newestPreferences);
    this._preferences.next(newestPreferences)
  }

  init(): Promise<T> {
    return from(this.storage.getItem<T>('preferences'))
      .pipe(
        switchMap((preferences) => {
          if (!preferences) {
            return this.storage.setItem('preferences', this.defaultPreferences)
          }

          return of({ ...this.defaultPreferences, ...preferences })
        }),
        tap((preferences) => {
          this._preferences.next(preferences)
        })
      )
      .toPromise()
  }
}
