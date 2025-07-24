import { Component, Input, signal } from "@angular/core";
import type { BacklogData } from "../../model/format.type";
import { StateBatteryComponent } from "../state-battery/state-battery.component";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
	selector: "app-card-backlog",
	imports: [StateBatteryComponent, CommonModule, MatTooltipModule],
	templateUrl: "./card-backlog.component.html",
	styleUrl: "./card-backlog.component.css",
})
export class CardBacklogComponent {
	@Input() backlogData: BacklogData = {
		backlogId: 101,
		backlogName: "Develop User Profile Page",
		priorityId: 2,
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

	periodPercentage = signal<number>(0);
	totalWork = signal(0);

	ngOnInit() {
		this.countTotalWorkState();
		this.countPercentage();
	}

	countTotalWorkState() {
		for (const state of this.backlogData.workStateCountList) {
			this.totalWork.set(this.totalWork() + state.stateCount);
		}
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
	setPeriodPercentage() {
		const start = new Date(this.backlogData.startDate).getTime();
		const end = new Date(this.backlogData.targetDate).getTime();
		const total = end - start;

		// Handle cases where the period is invalid or has ended/not started
		if (total <= 0) {
			return;
		}

		const percentage = (Date.now() - start) / total;
		this.periodPercentage.set(100 * Math.min(percentage, 1));
	}
}
