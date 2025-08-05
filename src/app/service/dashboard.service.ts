import { inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { UserTodoList } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class DashboardService {
	private dataService = inject(DataProcessingService);

	public readonly userTodoList = signal<UserTodoList[]>([]);

	constructor() {
		this.loadUserTodoList();
	}

	loadUserTodoList() {
		this.dataService.getUserTodoList().subscribe((data) => {
			this.userTodoList.set(data);
		});
	}
}
