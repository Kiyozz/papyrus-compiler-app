import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../models/group';
import { GroupsService } from '../../services/groups.service';
import { MatDialog } from '@angular/material';
import { AddGroupDialogComponent } from '../add-group-dialog/add-group-dialog.component';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {
  public groups: Group[];
  public draftGroup: Group = null;
  public editingGroup: Group = null;

  private groupsSubscription: Subscription;

  constructor(private groupsService: GroupsService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.groupsSubscription = this.groupsService.whenGroupsChanges()
      .subscribe(groups => {
        this.groups = groups;
        this.draftGroup = this.createGroup();
      });
  }

  ngOnDestroy(): void {
    this.groupsSubscription.unsubscribe();
  }

  public onClickAddGroup(e: Event): void {
    e.preventDefault();

    const dialogRef = this.dialog.open(AddGroupDialogComponent, {
      data: {
        draftGroup: this.draftGroup
      },
      maxWidth: 600
    });

    dialogRef.afterClosed().pipe(first()).subscribe(group => {
      if (group) {
        this.groupsService.addGroup(group).subscribe(() => {
          this.draftGroup = this.createGroup();
        });
      }
    });
  }

  public onClickEditGroup(group: Group, e: MouseEvent) {
    e.preventDefault();

    this.editingGroup = { ...group };
  }

  public onClickSaveGroup(e: MouseEvent) {
    e.preventDefault();

    this.groupsService.editGroup(this.editingGroup)
      .subscribe(() => {
        this.editingGroup = null;
      });
  }

  public groupScriptsInlined(group: Group): string {
    return group.scripts.join(', ');
  }

  public isEditingGroup(group: Group): boolean {
    if (!this.editingGroup) {
      return false;
    }

    return this.editingGroup.id === group.id;
  }

  public onClickDeleteGroup(group: Group, e: MouseEvent) {
    e.preventDefault();

    this.groupsService.removeGroup(group)
      .subscribe(() => {
      });
  }

  private createGroup(): Group {
    const maxId = this.groups === undefined ? 1 : this.groups.reduce((max, group) => {
      if (group.id > max) {
        return group.id;
      }

      return max;
    }, 0) + 1;

    return {
      id: maxId,
      name: '',
      scripts: []
    };
  }
}
