import { Component, inject, Input, signal } from "@angular/core";
import type { WorkData } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
	selector: "app-card-work",
	imports: [CommonModule, MatTooltipModule],
	templateUrl: "./card-work.component.html",
	styleUrl: "./card-work.component.css",
})
export class CardWorkComponent {
	dataService = inject(DataProcessingService);
	@Input() workData!: WorkData;
	periodPercentage = signal<number>(0);

	ngOnInit() {
		this.periodPercentage.set(
			this.dataService.getPeriodDonePercentage(
				this.workData.startDate,
				this.workData.targetDate,
			),
		);
	}
}
