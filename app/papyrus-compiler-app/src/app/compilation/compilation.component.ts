import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { Router } from '@angular/router';
import { APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION } from '../app-providers';
import { CompilationService } from '../compilation.service';
import {
  FLAG,
  GAME_PATH_FOLDER,
  IMPORTS_FOLDER,
  OUTPUT_FOLDER,
  SCRIPTS, scriptStringSeparator
} from '../preferences-keys';
import { PreferencesService } from '../preferences.service';
import { uniqueArray } from '../utils/utils';

@Component({
  selector: 'app-compilation',
  templateUrl: './compilation.component.html',
  styleUrls: ['./compilation.component.scss']
})
export class CompilationComponent implements OnInit {
  checkPreferencesMessage = '';
  scripts: string[];
  initialized = false;

  readonly separatesKeysCodes = [ENTER, COMMA];

  constructor(@Inject(APP_PREFERENCES_SESSION) private preferencesService: PreferencesService,
              @Inject(APP_PREFERENCES_LOCAL) private preferencesLocalService: PreferencesService,
              private compilationService: CompilationService,
              private router: Router) {
  }

  async ngOnInit() {
    const preferences = await this.preferencesLocalService.getAll([GAME_PATH_FOLDER, OUTPUT_FOLDER, IMPORTS_FOLDER, FLAG]);

    if (!preferences.outputFolder ||
        !preferences.gamePathFolder ||
        !preferences.importsFolder ||
        !preferences.flag
    ) {
      this.checkPreferencesMessage = `You need to provide :<br><br>
        ${!preferences.gamePathFolder ? '<strong>— Skyrim installation folder</strong><br>' : ''}
        ${!preferences.outputFolder ? '<strong>— Scripts output folder</strong><br>' : ''}
        ${!preferences.importsFolder ? '<strong>— Source scripts import folder</strong><br>' : ''}
        ${!preferences.flag ? '<strong>— Papyrus flag</strong><br>' : ''}<br>

        In your preferences before you can compile scripts.
      `;
    }

    this.scripts = await this.compilationService.getAllScripts();
    this.initialized = true;
  }

  add(event: MatChipInputEvent) {
    const { input, value } = event;

    if ((value || '').trim()) {
      this.scripts = [...this.scripts, value];
      this.scripts = uniqueArray(this.scripts);

      this.saveScripts(this.scripts);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(script: string) {
    this.scripts = this.scripts.filter(scr => scr !== script);

    this.saveScripts(this.scripts);
  }

  saveScripts(scripts: string[]) {
    this.preferencesService.save(SCRIPTS, scripts.join(scriptStringSeparator));
  }
}
