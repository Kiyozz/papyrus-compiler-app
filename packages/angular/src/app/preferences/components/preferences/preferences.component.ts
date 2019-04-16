import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'
import { APP_PREFERENCES_LOCAL } from '../../preferences-providers';
import { DialogService } from '../../../common/services/dialog.service';
import { PreferencesService, LocalPreferences } from '../../services/preferences.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit, OnDestroy {
  importsFolder = new FormControl('', [Validators.required]);
  outputFolder = new FormControl('', [Validators.required]);
  gamePathFolder = new FormControl('', [Validators.required]);
  selectedFlag = new FormControl('', [Validators.required]);
  availableFlags: string[] = ['TESV_Papyrus_Flags.flg'];
  initialized = false;

  preferencesSubscription: Subscription;
  private preferences: LocalPreferences;

  constructor(private dialogService: DialogService,
              private changeDetector: ChangeDetectorRef,
              @Inject(APP_PREFERENCES_LOCAL) private preferencesService: PreferencesService<LocalPreferences>) {
  }

  ngOnInit() {
    this.preferencesSubscription = this.preferencesService.preferences
      .pipe(first())
      .subscribe(preferences => {
        this.preferences = preferences;

        this.selectedFlag.setValue(preferences.flag)
        this.outputFolder.setValue(preferences.outputFolder);
        this.importsFolder.setValue(preferences.importsFolder);
        this.gamePathFolder.setValue(preferences.gamePathFolder);
        this.initialized = true;
      });
  }

  ngOnDestroy(): void {
    if (this.preferencesSubscription) {
      this.preferencesSubscription.unsubscribe();
    }
  }

  onClickImportFolderInput(e: MouseEvent) {
    const input = (e.currentTarget as HTMLInputElement);

    this.onClickFolderInput({ input, title: 'Select the output folder containing compiled scripts' })
      .then(folder => {
        if (folder.length > 0) {
          this.importsFolder.setValue(folder[0]);
          this.preferences.importsFolder = folder[0];
          this.preferencesService.save(this.preferences);
          this.changeDetector.detectChanges();
        }
      });
  }

  onClickOutputFolderInput(e: Event) {
    const input = (e.currentTarget as HTMLInputElement);

    this.onClickFolderInput({ input, title: 'Select the output folder containing compiled scripts' })
      .then(folder => {
        if (folder.length > 0) {
          this.outputFolder.setValue(folder[0]);
          this.preferences.outputFolder = folder[0];
          this.preferencesService.save(this.preferences);
          this.changeDetector.detectChanges();
        }
      });
  }

  onClickGamePathFolderInput(e: MouseEvent) {
    const input = (e.currentTarget as HTMLInputElement);

    this.onClickFolderInput({ input, title: 'Select the Skyrim installation folder' })
      .then(folder => {
        if (folder.length > 0) {
          this.gamePathFolder.setValue(folder[0]);
          this.preferences.gamePathFolder = folder[0];
          this.preferencesService.save(this.preferences);
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
    this.preferences.flag = flag;
    this.preferencesService.save(this.preferences);
  }
}
