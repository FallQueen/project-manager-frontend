import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type {
	AlterWork,
	GanttChartData,
	GanttItem,
	NameListItem,
} from "../model/format.type";
import { DialogService } from "./dialog.service";

@Injectable({
	providedIn: "root",
})
export class GanttPageService {
	private dataService = inject(DataProcessingService);
	private dialogService = inject(DialogService);
	public filterOptions = {
		// Populated reactively per project via effect below
		users: signal<NameListItem[] | null>(null),
		// These lists come from dataService (assumed already signals)
		tracker: this.dataService.trackerList,
		activity: this.dataService.activityList,
		state: this.dataService.stateList,
	};
	public ganttFilter = {
		users: signal<NameListItem[] | null>(null),
		tracker: signal<NameListItem[] | null>(null),
		activity: signal<NameListItem[] | null>(null),
		state: signal<NameListItem[] | null>(null),
		notAssigned: signal<boolean | null>(null),
	};
	public readonly ganttData = signal<GanttChartData | null>(null);
	public readonly filteredGanttData = signal<GanttChartData | null>(null);
	constructor() {
		// Refresh gantt data whenever project changes
		effect(() => {
			const projectId = this.dataService.projectIdSignal();
			this.refreshGanttData();
		});

		// Load assigned users per project; manage subscription cleanup
		effect(() => {
			const projectId = this.dataService.projectIdSignal();

			this.dataService
				.getProjectAssignedUsernames(projectId)
				.subscribe((users) => this.filterOptions.users.set(users));
		});
	}

	private refreshGanttData() {
		const projectId = this.dataService.projectIdSignal();
		this.dataService.getGanttDataOfProject(projectId).subscribe((data) => {
			console.log("Gantt data for project", projectId, ":", data);
			this.ganttData.set(data);
			this.filteredGanttData.set(data);
		});
	}

	public getGanttItemById(workId: number): GanttItem | null {
		for (const item of this.ganttData()?.ganttItemData || []) {
			const foundItem = item.works.find((work) => work.workId === workId);
			if (foundItem) {
				return foundItem;
			}
		}
		return null;
	}

	// (removed stray private setUser declaration)

	public alterDataOnWork(workId: number, alterData: AlterWork) {
		this.dataService.putAlterWork(alterData).subscribe((result) => {
			console.log("Work data updated:", result);
		});
	}

	public openWorkForm(workId: number, trackerName: string) {
		console.log(
			"Opening work form for workId:",
			workId,
			"trackerName:",
			trackerName,
		);

		if (trackerName === "BUG") {
			console.log("Opening bug dialog for workId:", workId);
			this.dialogService.openDialogForBugById(workId).subscribe((dialogRef) => {
				dialogRef.afterClosed().subscribe((result) => {
					console.log("Bug dialog closed with result:", result);
					if (result) {
						this.refreshGanttData();
					}
				});
			});
		} else if (trackerName === "TASK" || trackerName === "FEATURE") {
			console.log("Opening work dialog for workId:", workId);
			this.dialogService
				.openDialogForWorkById(workId)
				.subscribe((dialogRef) => {
					dialogRef.afterClosed().subscribe((result) => {
						console.log("Work dialog closed with result:", result);
						if (result) {
							this.refreshGanttData();
						}
					});
				});
		}
	}
}
