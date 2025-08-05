import { inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { BacklogData } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class BacklogPageService {
	private dataService = inject(DataProcessingService);
	private projectId = this.dataService.getProjectId(); // Replace with actual projectId as needed

	public readonly backlogList = signal<BacklogData[]>([]);

	constructor() {
		this.getProjectBacklogs(this.projectId);
	}

	getProjectBacklogs(projectId: number) {
		this.dataService.getProjectBacklogs(projectId).subscribe((result) => {
			this.backlogList.set(result);
		});
	}

	getCurrentProjectIdOfCurrentBacklog(): number {
		return this.projectId;
	}

	setCurrentProjectIdOfCurrentBacklog(projectId: number) {
		this.projectId = projectId;
	}
}
