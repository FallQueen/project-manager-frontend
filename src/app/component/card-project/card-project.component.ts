import { Component, Input, signal } from "@angular/core";
import type { Project } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-card-project",
	imports: [CommonModule, MatTooltipModule, MatIconModule],
	templateUrl: "./card-project.component.html",
	styleUrl: "./card-project.component.css",
})
export class CardProjectComponent {
	@Input() isEmpty!: true;
	@Input() project!: Project;
	projectPercentage = signal(0);
	progressTooltip = signal("");
	periodPercentage = signal(0);
	ngOnInit() {
		if (!this.isEmpty) {
			this.setProjectPercentageAndTooltip();
			this.setPeriodPercentage();
		}
	}

	setProjectPercentageAndTooltip() {
		if (this.project.totalTask !== 0) {
			this.projectPercentage.set(
				(this.project.doneTask / this.project.totalTask) * 100,
			);
			this.progressTooltip.set(
				`${this.project.doneTask} / ${this.project.totalTask} tasks`,
			);
		}
	}
	setPeriodPercentage() {
		const start = new Date(this.project.startDate).getTime();
		const end = new Date(this.project.targetDate).getTime();
		const total = end - start;

		// Handle cases where the period is invalid or has ended/not started
		if (total <= 0) {
			return;
		}

		const percentage = (Date.now() - start) / total;
		this.periodPercentage.set(100 * Math.min(percentage, 1));
	}
}
