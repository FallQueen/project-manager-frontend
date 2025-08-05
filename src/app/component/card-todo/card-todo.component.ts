import {
	Component,
	computed,
	effect,
	type ElementRef,
	inject,
	Input,
	type Signal,
	signal,
	type SimpleChanges,
	ViewChild,
} from "@angular/core";
import type {
	BatteryItem,
	UserTodoList,
	WorkData,
} from "../../model/format.type";
import { MatIconModule } from "@angular/material/icon";
import { CardWorkComponent } from "../card-work/card-work.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DataProcessingService } from "../../service/data-processing.service";
import { ExpandableWorkContainerComponent } from "../expandable-work-container/expandable-work-container.component";

@Component({
	selector: "app-card-todo",
	imports: [
		MatIconModule,
		CardWorkComponent,
		MatTooltipModule,
		ExpandableWorkContainerComponent,
	],
	templateUrl: "./card-todo.component.html",
	styleUrl: "./card-todo.component.css",
})
export class CardTodoComponent {
	dataService = inject(DataProcessingService);
	@Input() todoList: UserTodoList = {
		stateId: 0,
		stateName: "",
		works: [],
	};
	workList = signal<WorkData[]>([]);
	priorityBatteryItems: BatteryItem[] = [];

	expanded = signal(false);
	periodPercentage = signal<number>(0);
	totalWork = signal(0);
	containerTrigger = signal(false);

	@ViewChild("childContainer") childContainer!: ElementRef;
	childContainerHeight: Signal<number> = computed(() => {
		const expanded = this.expanded();
		const containerTrigger = this.containerTrigger();
		if (!expanded) return 0;
		if (!this.childContainer || !this.childContainer.nativeElement) return 0;
		let height = 0;

		height = this.childContainer.nativeElement.scrollHeight;
		return height;
	});

	// ngOnInit() {
	// 	this.refreshBattery();
	// }

	constructor() {
		effect(() => {
			const work = this.workList();
			this.refreshBattery();
		});
	}
	triggerContainerResize() {
		this.containerTrigger.set(!this.containerTrigger());
	}

	ngOnChanges() {
		if (this.todoList) {
			// This runs whenever todoList changes
			this.refreshBattery();
			this.workList.set(this.todoList.works);
		}
	}

	refreshBattery() {
		this.countBatteryTotal();
		this.countItemAndPercentage();
	}
	countBatteryTotal() {
		this.totalWork.set(this.todoList.works.length);
	}
	countItemAndPercentage() {
		this.priorityBatteryItems = [];
		for (const work of this.todoList.works) {
			const priorityItem = this.priorityBatteryItems.find(
				(i) => i.id === work.priorityId,
			);
			if (priorityItem) {
				priorityItem.count += 1;
			} else {
				this.priorityBatteryItems.push({
					id: work.priorityId,
					name: work.priorityName,
					count: 1,
					percentage: 0,
				});
			}
		}
		this.priorityBatteryItems.sort((a, b) => a.id - b.id);

		for (const item of this.priorityBatteryItems) {
			item.percentage = (100 * item.count) / this.totalWork();
		}
	}

	getTooltip(name: string, count: number, percentage: number): string {
		// Floor the percentage to one decimal place
		const formattedPercentage = Math.floor(percentage * 10) / 10;

		// Construct the string using a template literal
		return `${name} ${count}/${this.totalWork()} (${formattedPercentage}%)`;
	}

	expandWorkInside() {
		this.expanded.set(!this.expanded());
	}
}
