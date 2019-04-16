import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Group } from '../../models/group';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface AddGroupDialogData {
  draftGroup: Group;
}

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddGroupDialogComponent implements OnInit {
  public draftGroup: Group;

  constructor(private dialogRef: MatDialogRef<AddGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: AddGroupDialogData) {}

  ngOnInit() {
    this.draftGroup = this.data.draftGroup;
  }

  onSaveDraftGroupsScripts(scripts: string[]) {
    this.draftGroup = {
      ...this.draftGroup,
      scripts
    };
  }

  onClickResetGroup(e: MouseEvent) {
    e.preventDefault();

    this.dialogRef.close();
  }

  onClickSubmitGroup(e: MouseEvent) {
    e.preventDefault();

    this.dialogRef.close(this.draftGroup);
  }
}
