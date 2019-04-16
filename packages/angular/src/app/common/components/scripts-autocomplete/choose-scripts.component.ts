import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatChipInputEvent } from '@angular/material'
import { APP_PREFERENCES_LOCAL } from '../../../preferences/preferences-providers'
import { LocalPreferences, PreferencesService } from '../../../preferences/services/preferences.service'
import { uniqueArray } from '../../../utils/utils'

@Component({
  selector: 'app-choose-scripts',
  templateUrl: './choose-scripts.component.html',
  styleUrls: ['./choose-scripts.component.scss']
})
export class ChooseScriptsComponent implements OnInit {
  @Input('scripts') scripts: string[]
  @Input('label') label: string
  @Output('save') saveEmitter: EventEmitter<string[]> = new EventEmitter<string[]>()
  inputScriptFormControl = new FormControl()

  readonly separatesKeysCodes = [COMMA, ENTER]

  constructor(@Inject(APP_PREFERENCES_LOCAL) private preferencesLocalService: PreferencesService<LocalPreferences>) {
  }

  ngOnInit() {
  }

  add(event: MatChipInputEvent) {
    const { input, value } = event

    let trimedValue = (value || '').trim()

    if (trimedValue) {
      if (trimedValue.lastIndexOf('.psc') === -1) {
        trimedValue += '.psc'
      }

      this.scripts = [...this.scripts, trimedValue]
      this.scripts = uniqueArray(this.scripts)

      this.save()
    }

    if (input) {
      input.value = ''
    }
  }

  remove(script: string) {
    this.scripts = this.scripts.filter(scr => scr !== script)

    this.save()
  }

  save() {
    this.saveEmitter.emit(this.scripts)
  }
}
