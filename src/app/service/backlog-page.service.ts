import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { BacklogData } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class BacklogPageService {
	private dataService = inject(DataProcessingService);
	projectId = this.dataService.projectIdSignal;

	public readonly backlogList = signal<BacklogData[]>([]);

	constructor() {
		effect(() => {
			const projectId = this.projectId();

			this.getProjectBacklogs(projectId);
		});
	}

	getProjectBacklogs(projectId: number = this.projectId()) {
		if (projectId === 0) {
			this.backlogList.set([]);
			return;
		}
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
	// 	if (this.projectId() !== this.dataService.projectIdSignal()) {
	// 		this.projectId.set(this.dataService.projectIdSignal());
	// 		this.getProjectBacklogs(this.projectId());
	// 	}
	// }
}
