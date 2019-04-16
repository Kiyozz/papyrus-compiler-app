import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Group } from '../../groups/models/group';

export interface LocalPreferences {
  outputFolder: string;
  importsFolder: string;
  gamePathFolder: string;
  flag: string;
  groups: Group[];
}

export interface SessionPreferences {
  group: number;
}

@Injectable()
export class PreferencesService<T = LocalPreferences | SessionPreferences> {
  private _preferences: Subject<T> = new BehaviorSubject<T>(this.getAll());
  preferences = this._preferences.asObservable();

  constructor(private storage: Storage, private defaultPreferences: T) {
  }

  save(newestPreferences: T): void {
    this.storage.setItem('preferences', JSON.stringify(newestPreferences));
    this._preferences.next(newestPreferences)
  }

  private getAll(): T {
    const preferences = {
      ...this.defaultPreferences,
      ...JSON.parse(this.storage.getItem('preferences')) as T | null
    };

    if (!preferences) {
      this.storage.setItem('preferences', JSON.stringify(this.defaultPreferences));

      return this.defaultPreferences;
    }

    return preferences;
  }
}
