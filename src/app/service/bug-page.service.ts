import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { ProjectBugList } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class BugPageService {
	private dataService = inject(DataProcessingService);
	projectId = this.dataService.getProjectIdSignal();

	public readonly bugList = signal<ProjectBugList[]>([]);

	constructor() {
		this.getProjectBugs(this.projectId());
		effect(() => {
			const projectId = this.projectId();
			this.getProjectBugs(projectId);
		});
	}

	getProjectBugs(projectId: number) {
		if (projectId === 0) {
			this.bugList.set([]);
			return;
		}
		this.dataService.getProjectBugs(projectId).subscribe((result) => {
			this.bugList.set(result);
		});
	}
}
