import { Component, EventEmitter, inject, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import type { NameListItem } from "../../model/format.type";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogService } from "../../service/dialog.service";


@Component({
  selector: 'app-card-module-new',
  imports: [MatIconModule],
  templateUrl: './card-module-new.component.html',
  styleUrl: './card-module-new.component.css'
})
export class CardModuleNewComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	@Output() newModule = new EventEmitter<NameListItem>();

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialogService.openModuleDialog(undefined, true);

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
		dialogRef.afterClosed().subscribe((result) => {
			console.log("New sub-module check:", result);
			if (result) {
				this.newModule.emit(result); // Emits an event to refresh the parent component.
				console.log("New sub-module added:", result);
			}
		});
	}
}
