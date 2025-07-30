import { Component, inject, Input, signal } from "@angular/core";
import type { WorkData } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialog } from "@angular/material/dialog";
import { DialogWorkContainerComponent } from "../dialog-work-container/dialog-work-container.component";

@Component({
	selector: "app-card-work",
	imports: [CommonModule, MatTooltipModule],
	templateUrl: "./card-work.component.html",
	styleUrl: "./card-work.component.css",
})
export class CardWorkComponent {
	dataService = inject(DataProcessingService);
	dialog = inject(MatDialog);
	@Input() workData!: WorkData;
	periodPercentage = signal<number>(0);

	ngOnInit() {
		this.periodPercentage.set(
			this.dataService.getPeriodDonePercentage(
				this.workData.startDate,
				this.workData.targetDate,
			),
		);
	}

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialog.open(DialogWorkContainerComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "850vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { work: this.workData, newWork: false },
		});

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
	}
}
