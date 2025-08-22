import { I } from "@angular/cdk/keycodes";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogClose } from "@angular/material/dialog";

@Component({
	selector: "app-dialog-util-button-row",
	imports: [MatDialogClose, MatButtonModule],
	templateUrl: "./dialog-util-button-row.component.html",
	styleUrl: "./dialog-util-button-row.component.css",
})
export class DialogUtilButtonRowComponent {
	@Input() new = true;
	@Input() editable = false;
	@Input() haveBeenEdited = false;
	@Output() cancelEdit = new EventEmitter<void>();
	@Output() save = new EventEmitter<void>();
	@Output() create = new EventEmitter<void>();
}
