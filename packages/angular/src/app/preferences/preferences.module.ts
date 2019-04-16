import { NgModule } from '@angular/core';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION, createLocal, createSession } from './preferences-providers';
import { PreferencesRoutingModule } from './preferences-routing.module';
import { AppCommonModule } from '../common/modules/app-common/app-common.module';
import { FormsModule } from '@angular/forms';
import { MatChipsModule, MatFormFieldModule, MatSelectModule } from '@angular/material';

@NgModule({
  declarations: [
    PreferencesComponent,
  ],
  imports: [
    AppCommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    PreferencesRoutingModule,
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
  ]
})
export class PreferencesModule { }
