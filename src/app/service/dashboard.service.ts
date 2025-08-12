import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { UserTodoList } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class DashboardService {
	// Inject the DataProcessingService to access user and todo data
	private dataService = inject(DataProcessingService);

	// Signal to hold the list of todos for the user
	public readonly userTodoList = signal<UserTodoList[]>([]);

	// Signal to track the current user's ID
	private userId = this.dataService.userIdSignal;

	constructor() {
		// Reactively update the todo list when the user ID changes
		effect(() => {
			const currentUserId = this.userId();
			if (currentUserId === 0) {
				// If no user is logged in, clear the todo list
				this.userTodoList.set([]);
				return;
			}

			// Load the todo list for the current user
			this.loadUserTodoList();
		});
	}

	// Fetch the user's todo list from the data service and update the signal
	loadUserTodoList() {
		this.dataService.getUserTodoList().subscribe((data) => {
			this.userTodoList.set(data);
		});
	}
}
