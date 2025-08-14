import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { SubModuleData } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class BacklogPageService {
	// Inject the DataProcessingService dependency
	private dataService = inject(DataProcessingService);

	// Signal for the current project ID
	projectId = this.dataService.projectIdSignal;

	// Signal holding the list of subModules for the current project
	public readonly subModuleList = signal<SubModuleData[]>([]);

	constructor() {
		// Reactively fetch subModules whenever the project ID changes
		effect(() => {
			const projectId = this.projectId();
			this.getProjectSubModules(projectId);
		});
	}

	// Fetches subModules for a given project ID and updates the subModuleList signal
	getProjectSubModules(projectId: number = this.projectId()) {
		console.log(
			"BacklogPageService: Fetching subModules for projectId:",
			projectId,
		);
		if (projectId === 0) {
			// If project ID is 0, clear the subModule list
			this.subModuleList.set([]);
			return;
		}
		// Fetch subModules from the data service and update the signal
		console.log(
			"BacklogPageService: Fetching subModules from data service for projectId:",
			projectId,
		);
		this.dataService.getProjectSubModules(projectId).subscribe((result) => {
			this.subModuleList.set(result);
			console.log(
				"BacklogPageService: Fetched subModules:",
				this.subModuleList(),
			);
		});
	}

	// Removes a subModule item from the subModuleList signal by its ID
	removeSubModuleFromArray(subModuleId: number) {
		this.subModuleList.update((subModules) =>
			subModules.filter((subModule) => subModule.subModuleId !== subModuleId),
		);
	}
}
