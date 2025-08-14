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
	public readonly isWebMaster = this.dataService.isWebMaster;

	constructor() {
		// Reactively fetch project data when the userId changes
		effect(() => {
			console.log(
				"ProjectPageService: User ID changed, fetching projects...",
				this.userId(),
			);
			const isWebMaster = this.isWebMaster();
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
				console.log("ProjectPageService: Fetched projects:", this.Projects());
			});
		} else {
			// Otherwise, fetch only the projects that are related to the user
			this.dataService.getUserProjects().subscribe((result) => {
				this.Projects.set(result);
				console.log("ProjectPageService: Fetched projects:", this.Projects());
			});
		}
	}

	// Remove a project from the Projects array by its ID
	removeProjectFromArray(projectId: number) {
		this.Projects.update((projects) =>
			projects.filter((project) => project.projectId !== projectId),
		);
	}

	getProjectNameFromId(projectId: number): string | null {
		const project = this.Projects().find((p) => p.projectId === projectId);
		return project ? project.projectName : null;
	}
}
