import { inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { BacklogData } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class BacklogPageService {
	private dataService = inject(DataProcessingService);

	public readonly backlogList = signal<BacklogData[]>([]);

	constructor() {
		const projectId = 2; // Replace with actual projectId as needed
		this.dataService.getProjectBacklogs(projectId).subscribe((result) => {
			this.backlogList.set(result);
		});
	}
}
