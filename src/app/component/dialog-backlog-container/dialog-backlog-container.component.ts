import { Component, inject, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogBacklogDetailComponent } from "../dialog-backlog-detail/dialog-backlog-detail.component";
import { DialogBacklogInputComponent } from "../dialog-backlog-input/dialog-backlog-input.component";

@Component({
	selector: "app-dialog-backlog-container",
	imports: [
		MatDialogClose,
		MatIconModule,
		DialogBacklogDetailComponent,
		DialogBacklogInputComponent,
	],
	templateUrl: "./dialog-backlog-container.component.html",
	styleUrl: "./dialog-backlog-container.component.css",
})
export class DialogBacklogContainerComponent {
	dialogData = inject(MAT_DIALOG_DATA);
	editable = signal<boolean>(false);

	toggleEdit() {
		this.editable.set(!this.editable());
	}

	triggerNewBacklogSubmit() {}
	triggerEditBacklogSubmit() {}
}
