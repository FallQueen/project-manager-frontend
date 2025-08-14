import { effect, inject, Injectable, type Signal, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { NameListItem, ProjectBugList } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class BugPageService {
	// Inject the DataProcessingService to access project and bug data
	private dataService = inject(DataProcessingService);

	// Signal holding the current project ID
	projectId = this.dataService.projectIdSignal;

	// Signal holding the list of bugs for the current project
	public readonly bugList = signal<ProjectBugList[]>([]);

	constructor() {
		// Reactively fetch bugs whenever the project ID changes
		effect(() => {
			const projectId = this.projectId();
			this.setProjectBugs(projectId);
		});
	}

	// Fetches the list of bugs for a given project ID
	setProjectBugs(projectId: number = this.projectId()) {
		if (projectId === 0) {
			// If no project is selected, clear the bug list
			this.bugList.set([]);
			return;
		}
		// Otherwise, fetch bugs from the data service and update the signal
		this.dataService.getProjectBugs(projectId).subscribe((result) => {
			this.bugList.set(result);
		});
	}
}
