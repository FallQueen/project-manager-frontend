import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-profile-dialog",
  templateUrl: "./pop-up-profile.component.html",
  styleUrls: ["./pop-up-profile.component.css"],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule]
})
export class ProfileDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close();
  }
}
