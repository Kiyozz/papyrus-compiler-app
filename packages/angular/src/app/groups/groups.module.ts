import { NgModule } from '@angular/core';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './components/groups/groups.component';
import { AppCommonModule } from '../common/modules/app-common/app-common.module';
import { MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AddGroupDialogComponent } from './components/add-group-dialog/add-group-dialog.component';

@NgModule({
  declarations: [GroupsComponent, AddGroupDialogComponent],
  imports: [
    AppCommonModule,
    GroupsRoutingModule,
    MatListModule,
    FormsModule,
  ],
  entryComponents: [
    AddGroupDialogComponent,
  ]
})
export class GroupsModule {
}
