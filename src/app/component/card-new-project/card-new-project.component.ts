import { Component, inject, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogNewProjectComponent } from "../dialog-new-project/dialog-new-project.component";

@Component({
	selector: "app-card-new-project",
	imports: [MatIconModule],
	templateUrl: "./card-new-project.component.html",
	styleUrl: "./card-new-project.component.css",
})
export class CardNewProjectComponent {
	dialog = inject(MatDialog);
	empty = signal(true);

	changeForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialog.open(DialogNewProjectComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "90vw",
			height: "90vw",
			maxWidth: "90vw",
			maxHeight: "fit-content",
			panelClass: "custom-dialog-container",
		});

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
		dialogRef.afterClosed().subscribe((result) => {
			// If the dialog returns a truthy result,
			// emit the refresh event to the parent component.
		});
	}
}
