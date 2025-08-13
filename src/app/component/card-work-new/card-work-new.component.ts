import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogWorkContainerComponent } from "../dialog-work-container/dialog-work-container.component";
import type { SubModuleData, NameListItem } from "../../model/format.type";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-card-work-new",
	imports: [MatIconModule],
	templateUrl: "./card-work-new.component.html",
	styleUrl: "./card-work-new.component.css",
})
export class CardWorkNewComponent {
	dialog = inject(MatDialog);
	dialogService = inject(DialogService);
	@Output() newWork = new EventEmitter<NameListItem>();
	@Input() subModuleId!: number;

	openForm() {
		console.log("openForm", this.subModuleId);
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialogService.openWorkDialog(
			undefined,
			this.subModuleId,
			true,
		);

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
		dialogRef.afterClosed().subscribe((newState) => {
			if (newState) {
				this.newWork.emit(newState); // Emits an event to refresh the parent component.
			}
		});
	}
}
