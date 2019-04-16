import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutputComponent } from './components/output/output.component';

const routes: Routes = [
  { path: 'output', component: OutputComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutputRoutingModule { }
