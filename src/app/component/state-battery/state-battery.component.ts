import { Component, inject, Input, signal } from "@angular/core";
import type { NameListItem, WorkStateCount } from "../../model/format.type";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
	selector: "app-state-battery",
	imports: [MatTooltipModule],
	templateUrl: "./state-battery.component.html",
	styleUrl: "./state-battery.component.css",
})
export class StateBatteryComponent {
	dataService = inject(DataProcessingService);
	@Input() workStateCountList = [
		{ stateName: "A", stateCount: 4, stateId: 1, percentage: 0 },
		{ stateName: "B", stateCount: 6, stateId: 2, percentage: 0 },
	];
	totalWork = signal(0);

	ngOnInit() {
		this.countTotalWorkState();
		this.countPercentage();
	}

	countTotalWorkState() {
		for (const state of this.workStateCountList) {
			this.totalWork.set(this.totalWork() + state.stateCount);
		}
	}
	countPercentage() {
		for (const state of this.workStateCountList) {
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
}
