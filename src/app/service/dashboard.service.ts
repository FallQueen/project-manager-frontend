import { effect, inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { UserTodoList } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class DashboardService {
	private dataService = inject(DataProcessingService);
	public readonly userTodoList = signal<UserTodoList[]>([]);
	private userId = this.dataService.userIdSignal;

	constructor() {
		effect(() => {
			const currentUserId = this.userId();
			if (currentUserId === 0) {
				this.userTodoList.set([]);
				return;
			}

			this.loadUserTodoList();
		});
	}

	loadUserTodoList() {
		this.dataService.getUserTodoList().subscribe((data) => {
			this.userTodoList.set(data);
		});
	}
}
