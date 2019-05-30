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
import { MatSlideToggleModule, MatToolbarModule } from '@angular/material'
import { GroupsModule } from './groups/groups.module';
import { ThemeSwitcherComponent } from './common/components/theme-switcher/theme-switcher.component';
import { InitializationComponent } from './common/components/initialization/initialization.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ThemeSwitcherComponent,
    InitializationComponent
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
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
