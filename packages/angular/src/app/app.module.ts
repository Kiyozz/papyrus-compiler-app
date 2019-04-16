import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompilationModule } from './compilation/compilation.module';
import { ToolbarComponent } from './common/components/toolbar/toolbar.component'
import { PreferencesModule } from './preferences/preferences.module';
import { OutputModule } from './output/output.module';
import { AppCommonModule } from './common/modules/app-common/app-common.module';
import { MatToolbarModule } from '@angular/material';
import { GroupsModule } from './groups/groups.module';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppCommonModule,
    MatToolbarModule,
    CompilationModule,
    PreferencesModule,
    OutputModule,
    GroupsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
