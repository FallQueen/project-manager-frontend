import {
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
	signal,
} from "@angular/core";
import type { BugData, NameListItem, WorkData } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DialogService } from "../../service/dialog.service";
import { PopUpChangeComponent } from "../pop-up-change/pop-up-change.component";
import { DashboardPageService } from "../../service/dashboard-page.service";

@Component({
	selector: "app-card-work",
	imports: [CommonModule, MatTooltipModule, PopUpChangeComponent],
	templateUrl: "./card-work.component.html",
	styleUrl: "./card-work.component.css",
})
export class CardWorkComponent {
	dataService = inject(DataProcessingService);
	dashboardService = inject(DashboardPageService);
	dialogService = inject(DialogService);
	@Input() workData!: WorkData | BugData;
	@Output() triggerbatteryRefresh = new EventEmitter<void>();
	@Output() cardDeleted = new EventEmitter<number>();
	periodPercentage = signal<number>(0);

	ngOnInit() {
		console.log("workData", this.workData);
		if ("defectCause" in this.workData) {
			console.log("workData is BugData");
		}
		console.log("workData", this.workData);
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

		dialogRef.afterClosed().subscribe((result) => {
			if (result?.drop) {
				this.cardDeleted.emit(result.drop);
			}
		});
	}

	updateData(type: "priority" | "state", item: NameListItem) {
		if (type === "priority") {
			this.dataService
				.putAlterWork({
					workId: this.workData.workId,
					priorityId: item.id,
				})
				.subscribe(() => {
					this.workData.priorityId = item.id;
					this.workData.priorityName = item.name;
					this.triggerbatteryRefresh.emit();
				});
		} else if (type === "state") {
			this.workData.stateId = item.id;
			this.workData.stateName = item.name;
			this.dataService
				.putAlterWork({
					workId: this.workData.workId,
					currentState: item.id,
				})
				.subscribe(() => {
					this.workData.stateId = item.id;
					this.workData.stateName = item.name;
					// this.triggerbatteryRefresh.emit();
					this.dashboardService.loadUserTodoList();
				});
		}
	}
}
