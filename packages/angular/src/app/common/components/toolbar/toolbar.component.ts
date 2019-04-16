import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { WindowControlsService } from '../../services/window-controls.service'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  maximized = false

  constructor(private windowControlsService: WindowControlsService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.windowControlsService.whenMaximizeChanges()
      .subscribe(maximized => {
        this.maximized = maximized
        this.changeDetectorRef.detectChanges()
      })
  }

  onClickMinimize() {
    this.windowControlsService.minimize()
  }

  onClickToggleRestoreMaximize() {
    this.windowControlsService.toggleRestoreMaximize()
  }

  onClickClose() {
    this.windowControlsService.close()
  }
}
