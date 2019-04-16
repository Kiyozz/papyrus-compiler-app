import { NgModule } from '@angular/core';
import { CompilationComponent } from './components/compilation/compilation.component';
import { FormsModule } from '@angular/forms';
import { CompilationRoutingModule } from './compilation-routing.module';
import { AppCommonModule } from '../common/modules/app-common/app-common.module';
import { MatBadgeModule, MatChipsModule, MatFormFieldModule, MatSelectModule } from '@angular/material';

@NgModule({
  declarations: [
    CompilationComponent,
  ],
  imports: [
    AppCommonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatBadgeModule,
    FormsModule,
    CompilationRoutingModule,
    MatSelectModule,
  ]
})
export class CompilationModule { }
