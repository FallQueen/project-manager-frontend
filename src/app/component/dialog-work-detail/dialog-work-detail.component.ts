import { Component, Input } from "@angular/core";
import type { WorkData } from "../../model/format.type";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-dialog-work-detail",
	imports: [CommonModule],
	templateUrl: "./dialog-work-detail.component.html",
	styleUrl: "./dialog-work-detail.component.css",
})
export class DialogWorkDetailComponent {
	@Input() workData!: WorkData;
}
