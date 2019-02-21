import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompilationComponent } from './compilation/compilation.component';
import { OutputComponent } from './output/output.component'
import { PreferencesComponent } from './preferences/preferences.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: CompilationComponent },
  { path: 'output', component: OutputComponent },
  { path: 'preferences', component: PreferencesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
