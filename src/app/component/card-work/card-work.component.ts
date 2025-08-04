import { Component, inject, Input, signal } from "@angular/core";
import type { WorkData } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DialogService } from "../../service/dialog.service";
import { PopUpChangeComponent } from "../pop-up-change/pop-up-change.component";

@Component({
	selector: "app-card-work",
	imports: [CommonModule, MatTooltipModule, PopUpChangeComponent],
	templateUrl: "./card-work.component.html",
	styleUrl: "./card-work.component.css",
})
export class CardWorkComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
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
		const dialogRef = this.dialogService.openWorkDialog(
			this.workData,
			undefined,
			false,
		);

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
	}
}
