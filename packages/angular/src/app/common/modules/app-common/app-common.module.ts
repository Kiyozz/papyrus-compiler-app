import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowButtonsComponent } from '../../components/window-buttons/window-buttons.component';
import { CloseDialogComponent } from '../../components/close-dialog/close-dialog.component';
import { ContainerComponent } from '../../components/container/container.component';
import { NgxElectronModule } from 'ngx-electron';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule, MatChipsModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule, MatProgressSpinnerModule
} from '@angular/material';
import { ChooseScriptsComponent } from '../../components/choose-scripts/choose-scripts.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    WindowButtonsComponent,
    CloseDialogComponent,
    ContainerComponent,
    ChooseScriptsComponent,
  ],
  entryComponents: [
    CloseDialogComponent,
  ],
  imports: [
    CommonModule,
    NgxElectronModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    NgxElectronModule,
    WindowButtonsComponent,
    CloseDialogComponent,
    ContainerComponent,
    ChooseScriptsComponent,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ]
})
export class AppCommonModule { }
