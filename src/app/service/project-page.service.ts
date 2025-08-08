import { inject, Injectable, signal } from "@angular/core";
import type { Project } from "../model/format.type";
import { DataProcessingService } from "./data-processing.service";

@Injectable({
	providedIn: "root",
})
export class ProjectPageService {
	public dataService = inject(DataProcessingService);
	public readonly Projects = signal<Project[]>([]);

	constructor() {
		this.getProjectData();
	}

	getProjectData() {
		if (this.dataService.isWebMaster()) {
			this.dataService.getAllProjects().subscribe((result) => {
				this.Projects.set(result);
			});
		} else {
			this.dataService.getUserProjects().subscribe((result) => {
				this.Projects.set(result);
			});
		}
	}

	removeProjectFromArray(projectId: number) {
		this.Projects.update((projects) =>
			projects.filter((project) => project.projectId !== projectId),
		);
	}
}
