import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION } from '../../../preferences/preferences-providers';
import {
  LocalPreferences,
  PreferencesService,
  SessionPreferences
} from '../../../preferences/services/preferences.service';
import { of, Subscription, zip } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { Group } from '../../../groups/models/group';
import { GroupsService } from '../../../groups/services/groups.service';
import { GroupNotExistsException } from '../../../groups/exceptions/group-not-exists.exception';

@Component({
  selector: 'app-compilation',
  templateUrl: './compilation.component.html',
  styleUrls: ['./compilation.component.scss']
})
export class CompilationComponent implements OnInit, OnDestroy {
  initialized = false;
  sessionPreferences: SessionPreferences;
  checkPreferencesMessage = '';
  scripts: string[];
  groups: Group[];
  selectedGroup: Group = {
    id: -1,
    scripts: [],
    name: ''
  };

  private preferencesSubscription: Subscription;

  constructor(@Inject(APP_PREFERENCES_SESSION) private preferencesService: PreferencesService<SessionPreferences>,
              @Inject(APP_PREFERENCES_LOCAL) private preferencesLocalService: PreferencesService<LocalPreferences>,
              private groupsService: GroupsService) {
  }

  ngOnInit() {
    this.groupsService.whenGroupsChanges()
      .pipe(
        first(),
        map(groups => groups.filter(g => g.scripts.length > 0))
      )
      .subscribe(groups => {
        this.groups = groups;
      });

    this.preferencesSubscription = zip(this.preferencesLocalService.preferences, this.preferencesService.preferences)
      .pipe(
        first(),
        tap(([localPreferences, sessionPreferences]) => {
          this.sessionPreferences = sessionPreferences;

          if (!localPreferences.outputFolder ||
            !localPreferences.gamePathFolder ||
            !localPreferences.importsFolder ||
            !localPreferences.flag
          ) {
            this.checkPreferencesMessage = `You need to provide :<br><br>
            ${!localPreferences.gamePathFolder ? '<strong>— Skyrim installation folder</strong><br>' : ''}
            ${!localPreferences.outputFolder ? '<strong>— Scripts output folder</strong><br>' : ''}
            ${!localPreferences.importsFolder ? '<strong>— Source scripts import folder</strong><br>' : ''}
            ${!localPreferences.flag ? '<strong>— Papyrus flag</strong><br>' : ''}<br>
    
            In your preferences before you can compile scripts.
          `;
          }
        }),
        switchMap(([, sessionPreferences]) => {
          if (!sessionPreferences.group) {
            return of(null);
          }

          return this.groupsService.getGroupById(sessionPreferences.group);
        })
      )
      .subscribe((group) => {
        if (group) {
          this.scripts = group.scripts;
          this.selectedGroup = group;
        } else {
          this.scripts = [];
        }

        this.initialized = true;
      }, err => {
        if (err instanceof GroupNotExistsException) {
          this.scripts = [];
        }

        this.initialized = true;
      });
  }

  ngOnDestroy(): void {
    if (this.preferencesSubscription) {
      this.preferencesSubscription.unsubscribe();
    }
  }

  groupScriptsInlined(group: Group): string {
    const scripts = group.scripts || [];

    const slice = scripts.slice(0, 6);

    return scripts.length > 6 ? slice.join(', ') + ', ...' : slice.join(', ');
  }

  onSelectGroup(groupId: number) {
    const group = this.groups.find(g => g.id === groupId);

    if (!group) {
      throw new GroupNotExistsException();
    }

    this.scripts = group.scripts;
    this.selectedGroup = group;
    this.sessionPreferences.group = groupId;
    this.preferencesService.save(this.sessionPreferences);
  }
}
