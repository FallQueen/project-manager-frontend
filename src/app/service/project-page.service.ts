import { inject, Injectable, signal } from "@angular/core";
import type { Project } from "../model/format.type";
import { DataProcessingService } from "./data-processing.service";

@Injectable({
	providedIn: "root",
})
export class ProjectPageService {
	private dataService = inject(DataProcessingService);
	public readonly Projects = signal<Project[]>([]);

	constructor() {
		this.getProjectData();
	}
	getProjectData() {
		this.dataService.getProjects().subscribe((result) => {
			this.Projects.set(result);

			console.log(result[0]);
		});
	}
}
