import {
	Component,
	computed,
	type ElementRef,
	inject,
	Input,
	type Signal,
	signal,
	ViewChild,
} from "@angular/core";
import type { BatteryItem, UserTodoList } from "../../model/format.type";
import { MatIconModule } from "@angular/material/icon";
import { CardWorkComponent } from "../card-work/card-work.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DataProcessingService } from "../../service/data-processing.service";
import { PopUpChangeComponent } from "../pop-up-change/pop-up-change.component";

@Component({
	selector: "app-card-todo",
	imports: [
		MatIconModule,
		CardWorkComponent,
		PopUpChangeComponent,
		MatTooltipModule,
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
	priorityBatteryItems: BatteryItem[] = [];

	expanded = signal(false);
	periodPercentage = signal<number>(0);
	totalWork = signal(0);

	@ViewChild("childContainer") childContainer!: ElementRef;
	childContainerHeight: Signal<number> = computed(() => {
		const expanded = this.expanded();
		if (!expanded) return 0;
		if (!this.childContainer || !this.childContainer.nativeElement) return 0;
		let height = 0;

		height = this.childContainer.nativeElement.scrollHeight;
		return height;
	});
	ngOnInit() {
		this.countBatteryTotal();
		this.countItemAndPercentage();
		console.log(this.todoList);
	}

	countBatteryTotal() {
		this.totalWork.set(this.todoList.works.length);
	}
	countItemAndPercentage() {
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
