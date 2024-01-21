import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})

export class ConfirmationDialogComponent implements OnInit {
  public confirmMessage: string | undefined;
  public duplicatedName = false;
  public deleteAll = false;
  public deleteOne = false;
  
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {}

  ngOnInit(): void {
    if(this.data === 'duplicated') {
      this.duplicatedName = true;
    } else if(this.data === 'deleteAll') {
      this.deleteAll = true;
    } else if (this.data === 'deleteOne') {
      this.deleteOne = true;
    }
  }

  deleteLs() {
    this.dialogRef.close('deleteLs');
  }

  delete() {
    this.dialogRef.close('deleteOne');
  }

  closeModal() {
    this.dialogRef.close('exit');
  }
}
