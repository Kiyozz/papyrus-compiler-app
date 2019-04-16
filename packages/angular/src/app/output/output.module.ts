import { NgModule } from '@angular/core';
import { OutputComponent } from './components/output/output.component';
import { OutputLogsComponent } from './components/output-logs/output-logs.component';
import { OutputRoutingModule } from './output-routing.module';
import { AppCommonModule } from '../common/modules/app-common/app-common.module';
import { MatListModule, MatProgressBarModule } from '@angular/material';

@NgModule({
  declarations: [
    OutputComponent,
    OutputLogsComponent
  ],
  imports: [
    AppCommonModule,
    MatProgressBarModule,
    MatListModule,
    OutputRoutingModule
  ]
})
export class OutputModule { }
