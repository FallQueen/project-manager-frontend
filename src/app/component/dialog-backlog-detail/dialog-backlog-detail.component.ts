import { Component, Input } from "@angular/core";
import type { BacklogData } from "../../model/format.type";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-dialog-backlog-detail",
	imports: [CommonModule],
	templateUrl: "./dialog-backlog-detail.component.html",
	styleUrl: "./dialog-backlog-detail.component.css",
})
export class DialogBacklogDetailComponent {
	@Input() backlogData!: BacklogData;
}
