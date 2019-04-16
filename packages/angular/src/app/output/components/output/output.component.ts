import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CompilationService } from '../../../compilation/services/compilation.service';
import { OutputLogsService } from '../../services/output-logs.service';
import { of, Subscription } from 'rxjs';
import { APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION } from '../../../preferences/preferences-providers';
import {
  LocalPreferences,
  PreferencesService,
  SessionPreferences
} from '../../../preferences/services/preferences.service';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { GroupsService } from '../../../groups/services/groups.service';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit, OnDestroy {
  initialized = false;
  scripts: string[];
  successScripts: string[] = [];
  errorScripts: string[] = [];
  noScriptMessage = '';
  currentScriptInCompilation = '';
  compilationIsConfirmed = false;
  numberOfCompiledScripts = 0;
  maxNumberOfScripts = 0;

  private preferencesSubscription: Subscription;

  constructor(private compilationService: CompilationService,
              private logsService: OutputLogsService,
              private groupsService: GroupsService,
              @Inject(APP_PREFERENCES_LOCAL) private readonly preferencesService: PreferencesService<LocalPreferences>,
              @Inject(APP_PREFERENCES_SESSION) private readonly preferencesSessionService: PreferencesService<SessionPreferences>) {
  }

  get progress() {
    let progress = 0;

    if (this.maxNumberOfScripts === 0) {
      progress = 100;
    } else {
      progress = Math.round(this.numberOfCompiledScripts / this.maxNumberOfScripts * 100);

      if (progress > 100) {
        progress = 100;
      }
    }

    return progress;
  }

  get isCompilingAnyScript(): boolean {
    return this.currentScriptInCompilation !== '';
  }

  get inlinedScripts(): string {
    const length = this.scripts.length;
    const sliced = this.scripts.slice(0, 6);

    return sliced.join(', ') + (sliced.length < length ? ', ...' : '');
  }

  ngOnInit() {
    this.preferencesSubscription = this.preferencesSessionService.preferences
      .pipe(
        first(),
        tap(session => {
          if (!session.group) {
            this.noScriptMessage = 'Please provide a group of scripts in "Compile" section.';
          }
        }),
        switchMap(session => {
          const groupId = session.group;

          if (groupId) {
            return this.groupsService.getGroupById(groupId);
          }

          return of(null);
        }),
        map(group => {
          if (!group) {
            return [];
          }

          return group.scripts;
        })
      )
      .subscribe((scripts) => {
        if (scripts.length === 0) {
          this.scripts = [];
          this.noScriptMessage = 'Please provide a group of scripts in "Compile" section.';
        } else {
          this.scripts = scripts;
        }

        this.initialized = true;
      });
  }

  ngOnDestroy(): void {
    if (this.preferencesSubscription) {
      this.preferencesSubscription.unsubscribe();
    }
  }

  async handleScripts(scripts: string[]) {
    this.logsService.clear();
    this.maxNumberOfScripts = scripts.length;

    for (const script of scripts) {
      this.currentScriptInCompilation = script;

      try {
        await this.compilationService.compile(script);
        this.successScripts = [...this.successScripts, script];
      } catch (e) {
        this.errorScripts = [...this.errorScripts, script];
      }

      this.numberOfCompiledScripts++;
    }

    this.currentScriptInCompilation = '';
  }

  onClickConfirm(e: MouseEvent) {
    e.preventDefault();

    this.compilationIsConfirmed = true;
    this.handleScripts(this.scripts);
  }

  onClickRetryErrors(e: MouseEvent): void {
    e.preventDefault();

    if (this.errorScripts && this.errorScripts.length > 0) {
      const scripts = this.errorScripts;
      this.errorScripts = [];
      this.handleScripts(scripts);
    }
  }

  isCompiling(script: string) {
    return this.currentScriptInCompilation === script;
  }

  isSuccess(script: string) {
    return this.successScripts.includes(script);
  }

  isError(script: string) {
    return this.errorScripts.includes(script);
  }
}
