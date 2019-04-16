import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompilationComponent } from './compilation/components/compilation/compilation.component';
import { OutputComponent } from './output/components/output/output.component'
import { PreferencesComponent } from './preferences/components/preferences/preferences.component'

const routes: Routes = [
  { path: '', redirectTo: 'compilation', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
