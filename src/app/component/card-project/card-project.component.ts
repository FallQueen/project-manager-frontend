import { Component, inject, Input, signal } from "@angular/core";
import type { Project } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { DialogProjectContainerComponent } from "../dialog-project-container/dialog-project-container.component";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-card-project",
	imports: [CommonModule, MatTooltipModule, MatIconModule],
	templateUrl: "./card-project.component.html",
	styleUrl: "./card-project.component.css",
})
export class CardProjectComponent {
	dataService = inject(DataProcessingService);
	dialog = inject(MatDialog);

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
		this.projectPercentage.set(
			(this.project.doneTask / this.project.totalTask) * 100,
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
		this.periodPercentage.set(100 * Math.min(percentage, 1));
	}

	openForm() {
		// Uses the MatDialog service to open the DialogMoreDetailComponent.
		const dialogRef = this.dialog.open(DialogProjectContainerComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "850vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { project: this.project, newProject: false },
		});
		// Subscribes to the `afterClosed` event of the dialog.
		// This allows the component to react when the dialog is closed.
	}
}
