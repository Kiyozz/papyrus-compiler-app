import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { APP_PREFERENCES_LOCAL } from '../app-providers';
import { DialogService } from '../dialog.service';
import { PreferencesService } from '../preferences.service';
import {
  ALWAYS_COMPILE_SCRIPTS,
  FLAG,
  GAME_PATH_FOLDER,
  IMPORTS_FOLDER,
  OUTPUT_FOLDER,
  scriptStringSeparator
} from '../preferences-keys';
import { getScriptsFromString } from '../utils/utils';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  importsFolder = '';
  outputFolder = '';
  gamePathFolder = '';
  selectedFlag: string;
  availableFlags: string[] = ['TESV_Papyrus_Flags.flg'];
  alwaysCompileScripts = [];
  separatesKeysCodes = [ENTER, COMMA];
  initialized = false;

  constructor(private dialogService: DialogService,
              private changeDetector: ChangeDetectorRef,
              @Inject(APP_PREFERENCES_LOCAL) private preferencesService: PreferencesService) {
  }

  ngOnInit() {
    this.preferencesService.getAll([FLAG, IMPORTS_FOLDER, OUTPUT_FOLDER, ALWAYS_COMPILE_SCRIPTS, GAME_PATH_FOLDER])
      .then(values => {
        this.selectedFlag = values.flag;
        this.outputFolder = values.outputFolder;
        this.importsFolder = values.importsFolder;
        this.gamePathFolder = values.gamePathFolder;
        this.alwaysCompileScripts = getScriptsFromString(values.always_scripts);
        this.initialized = true;
      });
  }

  onClickImportFolderInput(e: MouseEvent) {
    const input = (e.currentTarget as HTMLInputElement);

    this.onClickFolderInput({ input, title: 'Select the output folder containing compiled scripts' })
      .then(folder => {
        if (folder.length > 0) {
          this.importsFolder = folder[0];
          this.preferencesService.save(IMPORTS_FOLDER, folder[0]);
          this.changeDetector.detectChanges();
        }
      });
  }

  onClickOutputFolderInput(e: Event) {
    const input = (e.currentTarget as HTMLInputElement);

    this.onClickFolderInput({ input, title: 'Select the output folder containing compiled scripts' })
      .then(folder => {
        if (folder.length > 0) {
          this.outputFolder = folder[0];
          this.preferencesService.save(OUTPUT_FOLDER, folder[0]);
          this.changeDetector.detectChanges();
        }
      });
  }

  onClickGamePathFolderInput(e: MouseEvent) {
    const input = (e.currentTarget as HTMLInputElement);

    this.onClickFolderInput({ input, title: 'Select the Skyrim installation folder' })
      .then(folder => {
        if (folder.length > 0) {
          this.gamePathFolder = folder[0];
          this.preferencesService.save(GAME_PATH_FOLDER, folder[0]);
          this.changeDetector.detectChanges();
        }
      });
  }

  onClickFolderInput({ input, title }: { input: HTMLInputElement, title: string }): Promise<string[]> {
    input.blur();

    return <any> this.dialogService.open({
      title,
      properties: ['openDirectory']
    })
      .catch((e: Error) => {
        alert(e.message);
      });
  }

  onChangeFlag(flag: string) {
    this.preferencesService.save(FLAG, flag);
  }

  addScript(event: MatChipInputEvent) {
    const { input, value } = event;

    if ((value || '').trim()) {
      this.alwaysCompileScripts = [...this.alwaysCompileScripts, value];

      this.saveAlwaysScripts(this.alwaysCompileScripts);
    }

    if (input) {
      input.value = '';
    }
  }

  removeScript(script: string) {
    this.alwaysCompileScripts = this.alwaysCompileScripts.filter(scr => scr !== script);

    this.saveAlwaysScripts(this.alwaysCompileScripts);
  }

  saveAlwaysScripts(scripts: string[]) {
    this.preferencesService.save(ALWAYS_COMPILE_SCRIPTS, scripts.join(scriptStringSeparator));
  }

}
