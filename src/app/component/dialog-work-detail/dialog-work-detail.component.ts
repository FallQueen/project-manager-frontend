import { Component, inject, Input } from "@angular/core";
import type { BugData, WorkData } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-dialog-work-detail",
	imports: [CommonModule],
	templateUrl: "./dialog-work-detail.component.html",
	styleUrl: "./dialog-work-detail.component.css",
})
export class DialogWorkDetailComponent {
	dataService = inject(DataProcessingService);
	@Input() workData!: WorkData | BugData;
}
