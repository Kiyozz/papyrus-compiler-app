import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Group } from '../models/group';
import { APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION } from '../../preferences/preferences-providers';
import {
  LocalPreferences,
  PreferencesService,
  SessionPreferences
} from '../../preferences/services/preferences.service';
import { first, map, tap } from 'rxjs/operators';
import { GroupExistsException } from '../exceptions/group-exists.exception';
import { GroupNotExistsException } from '../exceptions/group-not-exists.exception';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private groups$: Subject<Group[]> = new BehaviorSubject<Group[]>([]);
  private preferences: LocalPreferences;

  constructor(@Inject(APP_PREFERENCES_LOCAL) private preferencesService: PreferencesService<LocalPreferences>,
              @Inject(APP_PREFERENCES_SESSION) private preferencesSessionService: PreferencesService<SessionPreferences>) {
    this.preferencesService.preferences
      .pipe(first())
      .subscribe(preferences => {
        this.preferences = preferences;
        this.groups$.next(preferences.groups);
      });

    this.groups$
      .subscribe(groups => {
        this.preferences.groups = groups;
        this.preferencesService.save(this.preferences);
      });
  }

  public addGroup(group: Group): Observable<Group[]> {
    return this.groups$.pipe(
      first(),
      map(groups => {
        const groupExists = this.checkExists(groups, group);

        if (groupExists) {
          throw new GroupExistsException();
        }

        return [...groups, group];
      }),
      tap(groups => this.groups$.next(groups))
    );
  }

  public removeGroup(group: Group): Observable<Group[]> {
    return this.groups$.pipe(
      first(),
      map(groups => {
        const groupExists = this.checkExists(groups, group);

        if (!groupExists) {
          throw new GroupNotExistsException();
        }

        return groups.filter(g => g.name !== group.name);
      }),
      tap(groups => this.groups$.next(groups)),
      tap(groups => {
        this.preferencesSessionService.preferences
          .subscribe(sessionPreferences => {
            if (sessionPreferences.group) {
              const groupInList = groups.find(g => g.id === sessionPreferences.group);

              if (groupInList) {
                sessionPreferences.group = groupInList.id; // TODO: Save group id only instead of object

                this.preferencesSessionService.save(sessionPreferences);
              }
            }
          })
      })
    );
  }

  public editGroup(group: Group): Observable<Group[]> {
    return this.groups$.pipe(
      first(),
      map(groups => {
        const groupExists = this.checkExists(groups, group);

        if (!groupExists) {
          throw new GroupNotExistsException();
        }

        const groupIndexInList: number = groups.findIndex(g => g.id === group.id);

        groups[groupIndexInList] = group;

        return [...groups];
      }),
      tap(groups => {
        this.preferences.groups = groups;

        this.preferencesService.save(this.preferences);
      })
    );
  }

  public getGroupById(id: number): Observable<Group> {
    return this.groups$
      .pipe(
        map(groups => {
          const group = groups.find(g => g.id === id);

          if (!group) {
            throw new GroupNotExistsException();
          }

          return group;
        })
      );
  }

  public whenGroupsChanges(): Observable<Group[]> {
    return this.groups$.asObservable();
  }

  private checkExists(groups: Group[], group: Group): boolean {
    return groups.findIndex(g => g.id === group.id) !== -1;
  }
}
