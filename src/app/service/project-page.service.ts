import { effect, inject, Injectable, signal } from "@angular/core";
import type { Project } from "../model/format.type";
import { DataProcessingService } from "./data-processing.service";

@Injectable({
	providedIn: "root",
})
export class ProjectPageService {
	// Inject the necessary services
	public dataService = inject(DataProcessingService);

	// Signal to hold the list of projects
	public readonly Projects = signal<Project[]>([]);

	// Signal to hold the current user's ID
	public readonly userId = this.dataService.userIdSignal;

	constructor() {
		// Reactively fetch project data when the userId changes
		effect(() => {
			if (this.userId() === 0) {
				// If no user is logged in, clear the projects array
				this.Projects.set([]);
				return;
			}
			// Fetch project data for the current user
			this.getProjectData();
		});
	}

	// Fetch project data based on user role
	getProjectData() {
		if (this.dataService.isWebMaster()) {
			// If user is a webmaster, fetch all projects
			this.dataService.getAllProjects().subscribe((result) => {
				this.Projects.set(result);
			});
		} else {
			// Otherwise, fetch only the projects that are related to the user
			this.dataService.getUserProjects().subscribe((result) => {
				this.Projects.set(result);
			});
		}
	}

	// Remove a project from the Projects array by its ID
	removeProjectFromArray(projectId: number) {
		this.Projects.update((projects) =>
			projects.filter((project) => project.projectId !== projectId),
		);
	}
}
