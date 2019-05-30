import { APP_INITIALIZER, NgModule } from '@angular/core'
import * as localForage from 'localforage'
import { appInitializer } from '../common/providers/app-initializer.provider'
import { PreferencesComponent } from './components/preferences/preferences.component';
import {
  APP_LOCALFORAGE,
  APP_PREFERENCES_LOCAL,
  APP_PREFERENCES_SESSION,
  createLocal,
  createSession
} from './preferences-providers'
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
      useFactory: createLocal,
      deps: [APP_LOCALFORAGE]
    },
    {
      provide: APP_PREFERENCES_SESSION,
      useFactory: createSession,
      deps: [APP_LOCALFORAGE]
    },
    {
      provide: APP_LOCALFORAGE,
      useValue: localForage
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [APP_PREFERENCES_LOCAL, APP_PREFERENCES_SESSION, APP_LOCALFORAGE]
    }
  ]
})
export class PreferencesModule { }
