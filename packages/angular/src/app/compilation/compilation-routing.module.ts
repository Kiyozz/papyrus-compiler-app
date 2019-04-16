import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompilationComponent } from './components/compilation/compilation.component';

const routes: Routes = [
  { path: 'compilation', component: CompilationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompilationRoutingModule { }
