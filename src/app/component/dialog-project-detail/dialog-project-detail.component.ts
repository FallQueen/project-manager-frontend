import { Component, Input } from "@angular/core";
import type { Project } from "../../model/format.type";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-dialog-project-detail",
	imports: [CommonModule],
	templateUrl: "./dialog-project-detail.component.html",
	styleUrl: "./dialog-project-detail.component.css",
})
export class DialogProjectDetailComponent {
	@Input() project!: Project;
}
