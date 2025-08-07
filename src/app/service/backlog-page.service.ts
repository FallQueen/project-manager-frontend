import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { BacklogData } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class BacklogPageService {
	private dataService = inject(DataProcessingService);
	projectId = this.dataService.getProjectIdSignal();

	public readonly backlogList = signal<BacklogData[]>([]);

	constructor() {
		this.getProjectBacklogs(this.projectId());
		effect(() => {
			const projectId = this.projectId();
			this.getProjectBacklogs(projectId);
		});
	}

	getProjectBacklogs(projectId: number) {
		this.dataService.getProjectBacklogs(projectId).subscribe((result) => {
			this.backlogList.set(result);
		});
	}

	removeBacklogFromArray(backlogId: number) {
		this.backlogList.update((backlogs) =>
			backlogs.filter((backlog) => backlog.backlogId !== backlogId),
		);
	}

	// recheckProjectId() {
	// 	if (this.projectId() !== this.dataService.getProjectId()) {
	// 		this.projectId.set(this.dataService.getProjectId());
	// 		this.getProjectBacklogs(this.projectId());
	// 	}
	// }
}
