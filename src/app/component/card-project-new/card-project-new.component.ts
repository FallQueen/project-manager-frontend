import { Component, EventEmitter, inject, Output, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogProjectEditComponent } from "../dialog-project-edit/dialog-project-edit.component";
import { DialogProjectContainerComponent } from "../dialog-project-container/dialog-project-container.component";

@Component({
	selector: 'app-card-project-new',
	imports: [MatIconModule],
	templateUrl: './card-project-new.component.html',
	styleUrl: './card-project-new.component.css',
})
export class CardProjectNewComponent {
	dialog = inject(MatDialog);
	@Output() refresh = new EventEmitter<void>();

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialog.open(DialogProjectContainerComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "90vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { newProject: true },
		});

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.refresh.emit(); // Emits an event to refresh the parent component.
			}
		});
	}
}
