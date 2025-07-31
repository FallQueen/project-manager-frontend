import {
	Component,
	type ElementRef,
	inject,
	Input,
	signal,
	ViewChild,
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

@Component({
	selector: "app-card-backlog",
	imports: [
		CommonModule,
		MatTooltipModule,
		MatIconModule,
		CardWorkComponent,
		CardWorkNewComponent,
	],
	templateUrl: "./card-backlog.component.html",
	styleUrl: "./card-backlog.component.css",
})
export class CardBacklogComponent {
	dataService = inject(DataProcessingService);
	@Input() backlogData: BacklogData = {
		backlogId: 101,
		backlogName: "Develop User Profile Page",
		description: "a",
		priorityId: 2,
		createdBy: "a",
		priorityName: "MEDIUM",
		startDate: new Date("2025-07-20T09:00:00"),
		targetDate: new Date("2025-08-15T17:00:00"),
		workStateCountList: [
			{ stateId: 1, stateName: "To Do", stateCount: 5, percentage: 0 },
			{ stateId: 2, stateName: "In Progress", stateCount: 3, percentage: 0 },
			{ stateId: 3, stateName: "In Review", stateCount: 2, percentage: 0 },
			{ stateId: 4, stateName: "Done", stateCount: 10, percentage: 0 },
		],
	};

	@ViewChild("workChildContainer") workChildContainer!: ElementRef;
	workChildContainerHeight = signal<number>(0);

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

	updateContentHeight() {
		console.log("Updating content height");
		if (this.expanded()) {
			this.workChildContainerHeight.set(
				this.workChildContainer.nativeElement.scrollHeight,
			);
		}
	}

	AlterContentHeightBy(difference: number) {
		if (this.expanded()) {
			this.workChildContainerHeight.set(
				this.workChildContainerHeight() + difference,
			);
		}
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
		if (!this.workList().length) this.refreshWorkList();
		this.expanded.update((v) => {
			const expanded = !v;
			this.workChildContainerHeight.set(
				expanded ? this.workChildContainer.nativeElement.scrollHeight : 0,
			);
			return expanded;
		});
	}

	refreshWorkList() {
		this.dataService
			.getBacklogWorks(this.backlogData.backlogId)
			.subscribe((result) => {
				this.workList.set(result);
				setTimeout(() => {
					this.updateContentHeight();
				}, 4);
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
}
function thisupdateContentHeight() {
	throw new Error("Function not implemented.");
}
