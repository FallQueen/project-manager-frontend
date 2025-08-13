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

	public readonly bugCauseList = signal<NameListItem[]>([]);

	public readonly workNameList = signal<NameListItem[]>([]);

	constructor() {
		// Reactively fetch bugs whenever the project ID changes
		effect(() => {
			const projectId = this.projectId();
			this.getProjectBugs(projectId);
		});
	}

	// Fetches the list of bugs for a given project ID
	getProjectBugs(projectId: number) {
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

	// Fetches the list of bug causes for the current project
	getBugCauses(): Signal<NameListItem[]> {
		if (this.bugCauseList().length === 0) {
			// If no bug causes are present, fetch from the data service
			this.dataService.getDefectCauseList().subscribe((result) => {
				this.bugCauseList.set(result);
			});
		}
		return this.bugCauseList;
	}

	// Fetches the list of work names for the current project
	getWorkNames(): Signal<NameListItem[]> {
		if (this.workNameList().length === 0) {
			// If no work names are present, fetch from the data service
			this.dataService
				.getWorkNameListOfProject(this.projectId())
				.subscribe((result) => {
					this.workNameList.set(result);
				});
		}
		return this.workNameList;
	}
}
