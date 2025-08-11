import {
	Component,
	type ElementRef,
	inject,
	Input,
	type Signal,
	signal,
	ViewChild,
	computed,
	Output,
	EventEmitter,
} from "@angular/core";
import type {
	BacklogData,
	NameListItem,
	WorkData,
} from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { DataProcessingService } from "../../service/data-processing.service";
import { CardWorkComponent } from "../card-work/card-work.component";
import { CardWorkNewComponent } from "../card-work-new/card-work-new.component";
import ms from "@angular/common/locales/extra/ms";
import { MatDialog } from "@angular/material/dialog";
import { DialogBacklogContainerComponent } from "../dialog-backlog-container/dialog-backlog-container.component";
import { DialogService } from "../../service/dialog.service";
import { delay, expand } from "rxjs";
import { PopUpChangeComponent } from "../pop-up-change/pop-up-change.component";
import { ExpandableWorkContainerComponent } from "../expandable-work-container/expandable-work-container.component";

@Component({
	selector: "app-card-backlog",
	imports: [
		CommonModule,
		MatTooltipModule,
		MatIconModule,

		PopUpChangeComponent,
		ExpandableWorkContainerComponent,
	],
	templateUrl: "./card-backlog.component.html",
	styleUrl: "./card-backlog.component.css",
})
export class CardBacklogComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	@Input() backlogData!: BacklogData;
	@Output() cardDeleted = new EventEmitter<number>();

	expanded = signal(false);
	periodPercentage = signal<number>(0);
	totalWork = signal(0);

	workList = signal<WorkData[]>([]);

	ngOnInit() {
		this.countTotalWorkState();
		this.countPercentage();
		this.periodPercentage.set(
			this.dataService.getPeriodDonePercentage(
				this.backlogData.startDate,
				this.backlogData.targetDate,
			),
		);
	}

	countTotalWorkState() {
		let total = 0;
		for (const state of this.backlogData.workStateCountList) {
			total += state.stateCount;
		}
		this.totalWork.set(total);
	}
	countPercentage() {
		for (const state of this.backlogData.workStateCountList) {
			state.percentage = (100 * state.stateCount) / this.totalWork();
		}
	}

	getTooltip(
		stateName: string,
		stateCount: number,
		percentage: number,
	): string {
		// Floor the percentage to one decimal place
		const formattedPercentage = Math.floor(percentage * 10) / 10;

		// Construct the string using a template literal
		return `${stateName} ${stateCount}/${this.totalWork()} (${formattedPercentage}%)`;
	}

	expandWorkInside() {
		if (!this.workList().length && !this.expanded()) {
			this.refreshWorkList();
		} else {
			this.expanded.set(!this.expanded());
		}
	}

	refreshWorkList() {
		this.dataService
			.getBacklogWorks(this.backlogData.backlogId)
			.subscribe((result) => {
				this.workList.set(result);
				if (!this.expanded()) {
					setTimeout(() => {
						this.expanded.set(!this.expanded());
					}, 5);
				}
			});
	}

	doWhenNewWork(workState: NameListItem) {
		this.refreshWorkList();
		const index = this.backlogData.workStateCountList.findIndex(
			(item) => item.stateId === workState.id,
		);

		if (index !== -1) {
			this.backlogData.workStateCountList[index].stateCount += 1;
		}
		if (index === -1) {
			this.backlogData.workStateCountList.push({
				stateId: workState.id,
				stateName: workState.name,
				stateCount: 1,
				percentage: 0,
			});
		}
		this.countTotalWorkState();
		this.countPercentage();
	}

	openForm() {
		const dialogRef = this.dialogService.openBacklogDialog(
			this.backlogData,
			false,
		);

		dialogRef.afterClosed().subscribe((result) => {
			if (result?.drop) {
				this.cardDeleted.emit(result.drop);
			}
		});
	}

	updateBacklogData(type: "priority", item: NameListItem) {
		if (type === "priority") {
			this.dataService
				.putAlterBacklog({
					backlogId: this.backlogData.backlogId,
					priorityId: item.id,
				})
				.subscribe(() => {
					this.backlogData.priorityId = item.id;
					this.backlogData.priorityName = item.name;
				});
		}
	}
}
