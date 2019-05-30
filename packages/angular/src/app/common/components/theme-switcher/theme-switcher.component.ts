import { animate, state, style, transition, trigger } from '@angular/animations'
import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
import { MatSlideToggleChange } from '@angular/material'
import { timer } from 'rxjs'
import { Themes } from '../../enums/themes.enum'
import { InitializationService } from '../../services/initialization.service'
import { ThemeService } from '../../services/theme.service'

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
  animations: [
    trigger('enter', [
      transition(':enter', [
        style({ opacity: 0, visibility: 'hidden' }),
        animate('0.15s ease-in')
      ])
    ])
  ]
})
export class ThemeSwitcherComponent implements OnInit {
  theme: Themes
  show = false

  constructor(private themeService: ThemeService,
              private initializationService: InitializationService,
              @Inject(DOCUMENT) private document: Document) {
  }

  get isDark() {
    return this.theme === Themes.DARK
  }

  get isLight() {
    return this.theme === Themes.LIGHT
  }

  ngOnInit() {
    this.themeService.whenThemeChanges().subscribe((theme) => {
      this.theme = theme

      if (this.isDark) {
        this.document.body.classList.add('dark-theme')
        this.document.body.classList.remove('light-theme')
      } else {
        this.document.body.classList.add('light-theme')
        this.document.body.classList.remove('dark-theme')
      }
    })

    this.initializationService.whenInitializationChanges()
      .subscribe((initialized) => {
        if (initialized) {
          timer(1000)
            .subscribe(() => {
              this.show = true
            })
        }
      })
  }

  onChangeTheme(event: MatSlideToggleChange) {
    if (event.checked) {
      this.themeService.changeTheme(Themes.DARK)
    } else {
      this.themeService.changeTheme(Themes.LIGHT)
    }
  }
}
