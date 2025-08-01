import {
	Component,
	type ElementRef,
	inject,
	Input,
	type Signal,
	signal,
	ViewChild,
	computed,
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
import { delay } from "rxjs";

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
	dialogService = inject(DialogService);
	@Input() backlogData!: BacklogData;

	@ViewChild("workChildContainer") workChildContainer!: ElementRef;
	workChildContainerHeight: Signal<number> = computed(() => {
		const expanded = this.expanded();
		const workHover = this.workHovered();
		const workList = this.workList();
		console.log(
			"triggered workChildContainerHeight",
			expanded,
			workHover,
			workList.length,
		);
		if (!expanded) return 0;
		if (!this.workChildContainer || !this.workChildContainer.nativeElement)
			return 0;
		let height = 0;

		height = this.workChildContainer.nativeElement.scrollHeight;

		if (workHover === true && workList.length > 0) height += 50;
		return height;
	});

	expanded = signal(false);
	periodPercentage = signal<number>(0);
	totalWork = signal(0);
	workHovered = signal(false);

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
		if (!this.workList().length) {
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
				setTimeout(() => {
					this.expanded.set(!this.expanded());
				}, 5);
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
		// Uses the MatDialog service to open the DialogBacklogContainerComponent.
		const dialogRef = this.dialogService.openBacklogDialog(
			this.backlogData,
			false,
		);

		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
	}
}
