import { FormsModule } from '@angular/forms';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule, MatChipsModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule, MatProgressBarModule, MatSelectModule,
  MatToolbarModule,
  MatProgressSpinnerModule, MatDividerModule, MatDialogModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';
import { APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION, createLocal, createSession } from './app-providers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompilationComponent } from './compilation/compilation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OutputComponent } from './output/output.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { ContainerComponent } from './container/container.component';
import { OutputLogsComponent } from './output-logs/output-logs.component';
import { WindowButtonsComponent } from './window-buttons/window-buttons.component';
import { CloseDialogComponent } from './close-dialog/close-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CompilationComponent,
    OutputComponent,
    PreferencesComponent,
    ContainerComponent,
    OutputLogsComponent,
    WindowButtonsComponent,
    CloseDialogComponent,
  ],
  entryComponents: [
    CloseDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    NgxElectronModule,
    MatSelectModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: APP_PREFERENCES_LOCAL,
      useFactory: createLocal
    },
    {
      provide: APP_PREFERENCES_SESSION,
      useFactory: createSession
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
