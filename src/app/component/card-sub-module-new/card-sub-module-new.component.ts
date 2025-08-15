import { Component, EventEmitter, inject, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import type { NameListItem } from "../../model/format.type";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-card-sub-module-new",
	imports: [MatIconModule],
	templateUrl: "./card-sub-module-new.component.html",
	styleUrl: "./card-sub-module-new.component.css",
})
export class CardSubModuleNewComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	dialog = inject(MatDialog);
	@Output() newSubModule = new EventEmitter<NameListItem>();

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialogService.openSubModuleDialog(undefined, true);

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
		dialogRef.afterClosed().subscribe((result) => {
			console.log("New work check:", result);
			if (result) {
				this.newSubModule.emit(result); // Emits an event to refresh the parent component.
				console.log("New work added:", result);
			}
		});
	}
}
