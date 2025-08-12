import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { BacklogData } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class BacklogPageService {
	// Inject the DataProcessingService dependency
	private dataService = inject(DataProcessingService);

	// Signal for the current project ID
	projectId = this.dataService.projectIdSignal;

	// Signal holding the list of backlogs for the current project
	public readonly backlogList = signal<BacklogData[]>([]);

	constructor() {
		// Reactively fetch backlogs whenever the project ID changes
		effect(() => {
			const projectId = this.projectId();
			this.getProjectBacklogs(projectId);
		});
	}

	// Fetches backlogs for a given project ID and updates the backlogList signal
	getProjectBacklogs(projectId: number = this.projectId()) {
		if (projectId === 0) {
			// If project ID is 0, clear the backlog list
			this.backlogList.set([]);
			return;
		}
		// Fetch backlogs from the data service and update the signal
		this.dataService.getProjectBacklogs(projectId).subscribe((result) => {
			this.backlogList.set(result);
		});
	}

	// Removes a backlog item from the backlogList signal by its ID
	removeBacklogFromArray(backlogId: number) {
		this.backlogList.update((backlogs) =>
			backlogs.filter((backlog) => backlog.backlogId !== backlogId),
		);
	}
}
