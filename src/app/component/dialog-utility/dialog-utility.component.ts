import { Component, inject, Input, Signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: 'app-dialog-utility',
	imports: [MatIconModule, MatDialogClose, MatButtonModule],
	templateUrl: './dialog-utility.component.html',
	styleUrl: './dialog-utility.component.css',
})
export class DialogUtilityComponent {
	// Inject the data from the parent component
	dialogData = inject(MAT_DIALOG_DATA);
}
