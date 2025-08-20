import {
	Component,
	inject,
	Input,
	signal,
	Output,
	EventEmitter,
} from "@angular/core";
import type {
	SubModuleData,
	NameListItem,
	WorkData,
} from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogService } from "../../service/dialog.service";
import { PopUpChangeComponent } from "../pop-up-change/pop-up-change.component";
import { ExpandableWorkContainerComponent } from "../expandable-work-container/expandable-work-container.component";

@Component({
	selector: "app-card-sub-module",
	imports: [
		CommonModule,
		MatTooltipModule,
		MatIconModule,
		ExpandableWorkContainerComponent,
	],
	templateUrl: "./card-sub-module.component.html",
	styleUrl: "./card-sub-module.component.css",
})
export class CardSubModuleComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	@Input() subModuleData!: SubModuleData;
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
				this.subModuleData.startDate,
				this.subModuleData.targetDate,
			),
		);
	}

	ngOnChanges() {
		const subModuleData = this.subModuleData;
		this.workList.set([]);
	}

	countTotalWorkState() {
		let total = 0;
		if (!this.subModuleData.workStateCountList) {
			return;
		}
		for (const state of this.subModuleData.workStateCountList) {
			total += state.count;
		}
		this.totalWork.set(total);
	}
	countPercentage() {
		if (!this.subModuleData.workStateCountList) {
			return;
		}
		for (const state of this.subModuleData.workStateCountList) {
			state.percentage = (100 * state.count) / this.totalWork();
		}
	}

	getTooltip(name: string, count: number, percentage: number): string {
		// Floor the percentage to one decimal place
		const formattedPercentage = Math.floor(percentage * 10) / 10;

		// Construct the string using a template literal
		return `${name} ${count}/${this.totalWork()} (${formattedPercentage}%)`;
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
			.getSubModuleWorks(this.subModuleData.subModuleId)
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
		const workStateCountList = this.subModuleData.workStateCountList;
		if (!workStateCountList) {
			return;
		}
		const index = workStateCountList.findIndex(
			(item) => item.id === workState.id,
		);

		if (index !== -1) {
			workStateCountList[index].count += 1;
		}
		if (index === -1) {
			workStateCountList.push({
				id: workState.id,
				name: workState.name,
				count: 1,
				percentage: 0,
			});
		}
		this.countTotalWorkState();
		this.countPercentage();
	}

	openForm() {
		const dialogRef = this.dialogService.openSubModuleDialog(
			this.subModuleData,
			false,
		);

		dialogRef.afterClosed().subscribe((result) => {
			if (result?.drop) {
				this.cardDeleted.emit(result.drop);
			}
		});
	}

	updatesubModuleData(type: "priority", item: NameListItem) {
		if (type === "priority") {
			this.dataService
				.putAlterSubModule({
					subModuleId: this.subModuleData.subModuleId,
					priorityId: item.id,
				})
				.subscribe(() => {
					this.subModuleData.priorityId = item.id;
					this.subModuleData.priorityName = item.name;
				});
		}
	}
}
