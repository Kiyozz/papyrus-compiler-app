import { Component, OnInit } from '@angular/core';
import { CompilationService } from '../../../compilation/services/compilation.service';
import { ElectronService } from 'ngx-electron';
import { MatDialog } from '@angular/material';
import { CloseDialogComponent } from '../close-dialog/close-dialog.component';

@Component({
  selector: 'app-window-buttons',
  templateUrl: './window-buttons.component.html',
  styleUrls: ['./window-buttons.component.scss']
})
export class WindowButtonsComponent implements OnInit {
  isCompiling: boolean = false;

  constructor(private compilationService: CompilationService,
              private electronService: ElectronService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.compilationService.whenCompilingScriptChanges().subscribe(script => {
      this.isCompiling = script !== '';
    });
  }

  onClickMinimize(e: MouseEvent) {
    e.preventDefault();
    this.getCurrentWindow().minimize();
  }

  onClickMaximize(e: MouseEvent) {
    e.preventDefault();
    if (this.getCurrentWindow().isMaximized()) {
      this.getCurrentWindow().unmaximize();
    } else {
      this.getCurrentWindow().maximize();
    }
  }

  onClickClose(e: MouseEvent) {
    e.preventDefault();
    (e.currentTarget as HTMLButtonElement).blur();

     if (!this.isCompiling) {
      this.getCurrentWindow().close();
    } else {
      const dialogRef = this.dialog.open(CloseDialogComponent, {
      });

      dialogRef.afterClosed().subscribe(wantToClose => {
        if (wantToClose) {
          this.getCurrentWindow().close();
        }
      })
    }
  }

  private getCurrentWindow() {
    return this.electronService.remote.getCurrentWindow();
  }
}
