import { Component, inject, Input, signal } from "@angular/core";
import type { BugData, WorkData } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-dialog-work-bug-detail",
	imports: [CommonModule],
	templateUrl: "./dialog-work-bug-detail.component.html",
	styleUrl: "./dialog-work-bug-detail.component.css",
})
export class DialogWorkBugDetailComponent {
	dataService = inject(DataProcessingService);
	@Input() workData!: WorkData | BugData;
	@Input() isBug = false;
	nameTitle = signal(this.isBug ? "Bug Name" : "Work Name");
}
