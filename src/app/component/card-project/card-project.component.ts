import {
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
	signal,
} from "@angular/core";
import type { Project } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { DataProcessingService } from "../../service/data-processing.service";
import { Router } from "@angular/router";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-card-project",
	imports: [CommonModule, MatTooltipModule, MatIconModule],
	templateUrl: "./card-project.component.html",
	styleUrl: "./card-project.component.css",
})
export class CardProjectComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	router = inject(Router);

	@Input() isEmpty!: true;
	@Input() project!: Project;
	@Output() cardDeleted = new EventEmitter<number>();
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
		this.projectPercentage.set(
			Math.floor((this.project.doneTask / this.project.totalTask) * 10000) /
				100,
		);

		this.progressTooltip.set(
			`${this.project.doneTask} / ${this.project.totalTask} tasks`,
		);
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
		this.periodPercentage.set(
			Number(Math.min(Math.floor(percentage * 10000) / 100, 100)),
		);

		this.periodPercentage.set(
			Number(Math.min(Math.floor(percentage * 10000) / 100, 100)),
		);
	}

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialogService.openProjectDialog(this.project, false);
		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
		dialogRef.afterClosed().subscribe((result) => {
			if (result?.drop) {
				this.cardDeleted.emit(result.drop);
			}
		});
	}

	goToProject() {
		this.dataService.changeProject(
			this.project.projectId,
			this.project.projectName,
		);
	}
}
