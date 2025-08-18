import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { GanttChartData } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class GanttPageService {
	private dataService = inject(DataProcessingService);

	public readonly ganttData = signal<GanttChartData | null>(null);
	constructor() {
		effect(() => {
			const projectId = this.dataService.projectIdSignal();
			this.dataService.getGanttDataOfProject(projectId).subscribe((data) => {
				console.log("Gantt data for project", projectId, ":", data);
				this.ganttData.set(data);
			});
		});
	}
}
