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
	ModuleData,
} from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogService } from "../../service/dialog.service";
import { PopUpChangeComponent } from "../pop-up-change/pop-up-change.component";
import { ExpandableWorkContainerComponent } from "../expandable-work-container/expandable-work-container.component";

@Component({
	selector: "app-card-module",
	imports: [
		CommonModule,
		MatTooltipModule,
		MatIconModule,

		PopUpChangeComponent,
		ExpandableWorkContainerComponent,
	],
	templateUrl: "./card-module.component.html",
	styleUrl: "./card-module.component.css",
})
export class CardModuleComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	@Input() moduleData: ModuleData = {
		moduleId: 1,
		moduleName: "Sample Module",
		startDate: new Date(),
		targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		priorityId: 1,
		priorityName: "HIGH",
		workStateCountList: [
			{ id: 1, name: "NEW", count: 3, percentage: 0 },
			{ id: 2, name: "ASSIGNED", count: 2, percentage: 0 },
			{ id: 3, name: "IN PROGRESS", count: 5, percentage: 0 },
		],
		description: "abc",
		picId: 1,
		picName: "Alice",
		createdBy: "Alice",
		projectName: "Sample Project",
	};
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
				this.moduleData.startDate,
				this.moduleData.targetDate,
			),
		);
	}

	// ngOnChanges() {
	// 	this.workList.set([]);
	// }

	countTotalWorkState() {
		let total = 0;
		for (const state of this.moduleData.workStateCountList) {
			total += state.count;
		}
		this.totalWork.set(total);
	}
	countPercentage() {
		for (const state of this.moduleData.workStateCountList) {
			state.percentage = (100 * state.count) / this.totalWork();
		}
	}

	getTooltip(name: string, count: number, percentage: number): string {
		const formattedPercentage = Math.floor(percentage * 10) / 10;
		return `${name} ${count}/${this.totalWork()} (${formattedPercentage}%)`;
	}

	expandWorkInside() {
		// 	if (!this.workList().length && !this.expanded()) {
		// 		this.refreshWorkList();
		// 	} else {
		// 		this.expanded.set(!this.expanded());
		// 	}
	}

	refreshWorkList() {
		// 	// You may want to implement a getModuleWorks API for modules
		// 	// For now, this is a placeholder
		// 	// this.dataService.getModuleWorks(this.moduleData.moduleId).subscribe((result) => {
		// 	// 	this.workList.set(result);
		// 	// 	if (!this.expanded()) {
		// 	// 		setTimeout(() => {
		// 	// 			this.expanded.set(!this.expanded());
		// 	// 		}, 5);
		// 	// 	}
		// 	// });
	}

	// doWhenNewWork(workState: NameListItem) {
	// 	this.refreshWorkList();
	// 	const index = this.moduleData.workStateCountList.findIndex(
	// 		(item) => item.id === workState.id,
	// 	);

	// 	if (index !== -1) {
	// 		this.moduleData.workStateCountList[index].count += 1;
	// 	}
	// 	if (index === -1) {
	// 		this.moduleData.workStateCountList.push({
	// 			id: workState.id,
	// 			name: workState.name,
	// 			count: 1,
	// 			percentage: 0,
	// 		});
	// 	}
	// 	this.countTotalWorkState();
	// 	this.countPercentage();
	// }

	openForm() {
		// 	// You may want to implement a module dialog for editing modules
		// 	// const dialogRef = this.dialogService.openModuleDialog(this.moduleData, false);
		// 	// dialogRef.afterClosed().subscribe((result) => {
		// 	// 	if (result?.drop) {
		// 	// 		this.cardDeleted.emit(result.drop);
		// 	// 	}
		// 	// });
	}

	updatesubModuleData(type: "priority", item: NameListItem) {
		// 	if (type === "priority") {
		// 		// You may want to implement a putAlterModule API for modules
		// 		// this.dataService.putAlterModule({
		// 		// 	moduleId: this.moduleData.moduleId,
		// 		// 	priorityId: item.id,
		// 		// }).subscribe(() => {
		// 		// 	this.moduleData.priorityId = item.id;
		// 		// 	this.moduleData.priorityName = item.name;
		// 		// });
		// 	}
	}
}
