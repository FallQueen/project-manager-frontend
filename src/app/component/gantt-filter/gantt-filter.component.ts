import { Component, inject, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { GanttPageService } from "../../service/gantt-page.service";
import { MatCheckboxModule } from "@angular/material/checkbox";

@Component({
	selector: "app-gantt-filter",
	imports: [MatIconModule, MatCheckboxModule],
	templateUrl: "./gantt-filter.component.html",
	styleUrl: "./gantt-filter.component.css",
})
export class GanttFilterComponent {
	ganttPageService = inject(GanttPageService);
	mouseDown = signal(false);

	ngOnInit() {
		window.addEventListener("mousedown", () => this.mouseDown.set(true));
		window.addEventListener("mouseup", () => this.mouseDown.set(false));
	}
}
