import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import type { NameListItem, Project } from "../../model/format.type";
import { DialogBacklogContainerComponent } from "../dialog-backlog-container/dialog-backlog-container.component";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-card-backlog-new",
	imports: [MatIconModule],
	templateUrl: "./card-backlog-new.component.html",
	styleUrl: "./card-backlog-new.component.css",
})
export class CardBacklogNewComponent {
	dataService = inject(DataProcessingService);
	dialog = inject(MatDialog);
	@Output() newWork = new EventEmitter<NameListItem>();

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialog.open(DialogBacklogContainerComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "90vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { newBacklog: true, projectId: this.dataService.getprojectId() }, // Passes data to the dialog.
		});

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.newWork.emit(result); // Emits an event to refresh the parent component.
			}
		});
	}
}
