import { Component, EventEmitter, inject, Output, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogProjectInputComponent } from "../dialog-project-input/dialog-project-input.component";
import { DialogProjectContainerComponent } from "../dialog-project-container/dialog-project-container.component";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-card-project-new",
	imports: [MatIconModule],
	templateUrl: "./card-project-new.component.html",
	styleUrl: "./card-project-new.component.css",
})
export class CardProjectNewComponent {
	dialogService = inject(DialogService);

	@Output() refresh = new EventEmitter<void>();

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialogService.openProjectDialog(undefined, true);

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
		dialogRef.afterClosed().subscribe((result) => {
			if (result === "new") {
				this.refresh.emit(); // Emits an event to refresh the parent component.
			}
		});
	}
}
