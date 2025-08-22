import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type {
	AlterWork,
	GanttChartData,
	GanttItem,
	GanttItemsBasedOnProject,
	NameListItem,
} from "../model/format.type";
import { DialogService } from "./dialog.service";

@Injectable({ providedIn: "root" })
export class GanttPageService {
	// Inject the data service for API/data access (needed for fetching Gantt data and filter options)
	private dataService = inject(DataProcessingService);
	// Inject the dialog service for opening dialogs (needed for work/bug detail popups)
	private dialogService = inject(DialogService);

	// Available choice lists (option sources, not user selections)
	public readonly usersList = signal<NameListItem[] | null>(null); // populated async per project
	public readonly filterOptions = {
		tracker: this.dataService.trackerList, // List of tracker types (e.g., TASK, BUG, FEATURE)
		activity: this.dataService.activityList, // List of activity types
		state: this.dataService.stateList, // List of possible work states
	};

	// Pass-through accessors so template can call ganttPageService.trackerList() etc.
	public trackerList() {
		return this.filterOptions.tracker();
	}
	public activityList() {
		return this.filterOptions.activity();
	}
	public stateList() {
		return this.filterOptions.state();
	}

	// ganttFilter holds the user's current filter selections
	// Each is a signal so the UI and filtering logic can react to changes
	// null means filter is OFF; empty array is also treated as OFF for usability
	public ganttFilter = {
		users: signal<NameListItem[] | null>(null), // Which users to filter by (null = all)
		tracker: signal<NameListItem[] | null>(null), // Which tracker types to filter by
		activity: signal<NameListItem[] | null>(null), // Which activities to filter by
		state: signal<NameListItem[] | null>(null), // Which states to filter by
		assigned: signal<boolean | null>(null), // true = only assigned, false = only unassigned, null = all
	};
	public readonly ganttData = signal<GanttChartData | null>(null);
	// filteredGanttData holds the filtered view, updated automatically when data or filters change
	public readonly filteredGanttData = signal<GanttItemsBasedOnProject[]>([]);

	constructor() {
		// Effect: When the project changes, fetch new Gantt data
		effect(() => {
			const projectId = this.dataService.projectIdSignal(); // get current project id
			this.refreshGanttData(); // fetch and store new data for this project
		});

		effect(() => {
			const projectId = this.dataService.projectIdSignal();
			// API call returns observable; subscribe and update the users option list
			this.dataService
				.getProjectAssignedUsernames(projectId)
				.subscribe((users) => this.usersList.set(users));
		});

		// Effect: Whenever data or any filter changes, recompute the filtered view
		effect(() => {
			this.ganttData(); // dependency: raw data
			this.ganttFilter.users(); // dependency: user filter
			this.ganttFilter.tracker(); // dependency: tracker filter
			this.ganttFilter.activity(); // dependency: activity filter
			this.ganttFilter.state(); // dependency: state filter
			this.ganttFilter.assigned(); // dependency: assigned filter
			// Actually run the filter logic and update the filtered view
			this.filteredGanttData.set(this.applyFilters());
		});
	}

	// Resets all filters to OFF (null), so the full dataset is shown
	private resetFilters() {
		this.ganttFilter.users.set(null); // clear user filter
		this.ganttFilter.tracker.set(null); // clear tracker filter
		this.ganttFilter.activity.set(null); // clear activity filter
		this.ganttFilter.state.set(null); // clear state filter
		this.ganttFilter.assigned.set(null); // clear assigned filter
	}

	// Fetches the full Gantt dataset for the current project and stores it
	private refreshGanttData() {
		const projectId = this.dataService.projectIdSignal(); // get current project id
		this.dataService.getGanttDataOfProject(projectId).subscribe((data) => {
			this.ganttData.set(data); // store the raw data
			this.filteredGanttData.set(data?.ganttItemData || []); // show all by default
			console.log("Gantt Data refreshed for project",data);
		});
	}

	// Applies all active filters to the raw Gantt data and returns the filtered result
	private applyFilters(): GanttItemsBasedOnProject[] {
		const base = this.ganttData(); // get the raw data
		if (!base) return []; // if no data, return empty

		// Get current filter selections
		const usersFilter = this.ganttFilter.users();
		const trackerFilter = this.ganttFilter.tracker();
		const activityFilter = this.ganttFilter.activity();
		const stateFilter = this.ganttFilter.state();
		const assignedFlag = this.ganttFilter.assigned();

		// Convert filter arrays to Sets for fast lookup (O(1)); null means filter is off
		const userIdSet = usersFilter?.length
			? new Set(usersFilter.map((u) => u.id))
			: null;
		const trackerNameSet = trackerFilter?.length
			? new Set(trackerFilter.map((t) => t.name))
			: null;
		const activityNameSet = activityFilter?.length
			? new Set(activityFilter.map((a) => a.name))
			: null;
		const stateNameSet = stateFilter?.length
			? new Set(stateFilter.map((s) => s.name))
			: null;

		const out: GanttItemsBasedOnProject[] = [];
		// For each module in the project...
		for (const mod of base.ganttItemData) {
			console.log("Processing module:", mod.moduleName);
			const works: GanttItem[] = [];
			// For each work item in the module...
			for (const w of mod.works) {
				// If user filter is ON, skip works not assigned to any selected user
				if (userIdSet && !w.assignedUsers?.some((u) => userIdSet.has(u.id)))
					continue;
				// If tracker filter is ON, skip works not matching selected tracker
				if (trackerNameSet && !trackerNameSet.has(w.trackerName)) continue;
				// If activity filter is ON, skip works not matching selected activity
				if (activityNameSet && !activityNameSet.has(w.activityName)) continue;
				// If state filter is ON, skip works not matching selected state
				if (stateNameSet) {
					const stateName = (w as unknown as { stateName?: string }).stateName;
					if (!stateName || !stateNameSet.has(stateName)) continue;
				}
				// If assigned filter is ON, skip works that don't match assigned/unassigned
				if (assignedFlag !== null) {
					const hasAssigned = !!w.assignedUsers?.length;
					if (assignedFlag && !hasAssigned) continue; // want only assigned
					if (!assignedFlag && hasAssigned) continue; // want only unassigned
				}
				// If all filters pass, keep this work
				works.push(w);
			}
			// Only keep modules that have at least one work after filtering
			out.push({ ...mod, works });
		}
		console.log("Filtered Gantt Data:", out);
		return out;
	}

	checkFilterHas(
		value: NameListItem,
		type: "users" | "tracker" | "activity" | "state",
	) {
		const filterSignal = this.ganttFilter[type];
		const currentList = filterSignal() || [];
		return currentList.some((item) => item.name === value.name);
	}

	// Toggles a filter selection on or off for the given filter type
	setGanttFilter(
		value: NameListItem,
		type: "users" | "tracker" | "activity" | "state",
	) {
		const filterSignal = this.ganttFilter[type];
		const currentList = filterSignal() || [];
		const exists = currentList.some((item) => item.name === value.name);
		// If already selected, remove; otherwise, add
		filterSignal.set(
			exists
				? currentList.filter((item) => item.name !== value.name)
				: [...currentList, value],
		);
		console.log(filterSignal());
	}

	setGanttFilterForAssigned(value: true | false | null) {
		if (this.ganttFilter.assigned() === value) {
			this.ganttFilter.assigned.set(null);
		} else {
			this.ganttFilter.assigned.set(value);
		}
	}

	// Finds and returns a single GanttItem by its workId, or null if not found
	getGanttItemById(workId: number): GanttItem | null {
		for (const item of this.ganttData()?.ganttItemData || []) {
			const found = item.works.find((w) => w.workId === workId);
			if (found) return found;
		}
		return null;
	}

	// Sends an update for a work item to the backend (does not auto-refresh the whole Gantt data)
	alterDataOnWork(workId: number, alterData: AlterWork) {
		this.dataService.putAlterWork(alterData).subscribe((result) => {
			console.log("Work data updated:", result);
		});
	}

	// Opens the appropriate dialog for a work item (bug or task/feature)
	// If the dialog reports changes, refreshes the Gantt data
	openWorkForm(workId: number, trackerName: string) {
		if (trackerName === "BUG") {
			this.dialogService.openDialogForBugById(workId).subscribe((dialogRef) => {
				dialogRef.afterClosed().subscribe((result) => {
					if (result) this.refreshGanttData();
				});
			});
		} else if (trackerName === "TASK" || trackerName === "FEATURE") {
			this.dialogService
				.openDialogForWorkById(workId)
				.subscribe((dialogRef) => {
					dialogRef.afterClosed().subscribe((result) => {
						if (result) this.refreshGanttData();
					});
				});
		}
	}

	openModuleForm(moduleId: number) {
		console.log("Opening module form for ID:", moduleId);
		this.dialogService.openModuleDialogById(moduleId).subscribe((dialogRef) => {
			dialogRef.afterClosed().subscribe((result) => {
				if (result) this.refreshGanttData();
			});
		});
	}
}
