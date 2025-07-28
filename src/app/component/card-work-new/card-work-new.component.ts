import { Component, EventEmitter, inject, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogWorkContainerComponent } from "../dialog-work-container/dialog-work-container.component";

@Component({
	selector: "app-card-work-new",
	imports: [MatIconModule],
	templateUrl: "./card-work-new.component.html",
	styleUrl: "./card-work-new.component.css",
})
export class CardWorkNewComponent {
	dialog = inject(MatDialog);
	@Output() refresh = new EventEmitter<void>();

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialog.open(DialogWorkContainerComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "90vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { newWork: true },
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
