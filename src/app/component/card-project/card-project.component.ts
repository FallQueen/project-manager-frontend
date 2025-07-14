import { Component, Input, signal } from "@angular/core";
import type { project } from "../../model/format.type";
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
	project = signal<project>({
		projectId: 1,
		projectName: "Test Project",
		pic: "Alice",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae massa eu ligula tempus ultricies. Donec tempus pretium mi. Fusce efficitur varius nisi sit amet ultricies.",
		startDate: new Date(),
		totalTask: 10,
		doneTask: 5,
	});
	projectPercentage = signal(
		(this.project().doneTask / this.project().totalTask) * 100,
	);
	progressTooltip = signal(
		`${this.project().doneTask} / ${this.project().totalTask} tasks`,
	);
}
