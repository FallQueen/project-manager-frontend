import { Component, inject, signal, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogBacklogDetailComponent } from "../dialog-backlog-detail/dialog-backlog-detail.component";
import { DialogBacklogInputComponent } from "../dialog-backlog-input/dialog-backlog-input.component";
import { MatButtonModule } from "@angular/material/button";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogUtilButtonRowComponent } from "../dialog-util-button-row/dialog-util-button-row.component";
import { DialogUtilTitleComponent } from "../dialog-util-title/dialog-util-title.component";

@Component({
	selector: "app-dialog-backlog-container",
	imports: [
		MatIconModule,
		DialogBacklogDetailComponent,
		DialogBacklogInputComponent,
		MatButtonModule,
		DialogUtilButtonRowComponent,
		DialogUtilTitleComponent,
	],
	templateUrl: "./dialog-backlog-container.component.html",
	styleUrl: "./dialog-backlog-container.component.css",
})
export class DialogBacklogContainerComponent {
	dataService = inject(DataProcessingService);
	dialogData = inject(MAT_DIALOG_DATA);
	editable = signal<boolean>(false);

	@ViewChild(DialogBacklogInputComponent)
	DialogBacklogInput!: DialogBacklogInputComponent;

	ngOnInit() {}

	toggleEdit() {
		this.editable.set(!this.editable());
	}

	triggerNewBacklogSubmit() {
		this.DialogBacklogInput.newBacklogCreate();
	}
	triggerEditBacklogSubmit() {
		this.DialogBacklogInput.backlogEdit();
		this.toggleEdit();
	}

	triggerDeleteBacklog() {
		this.DialogBacklogInput.dropBacklog();
	}
}
