import { inject, Injectable, signal } from "@angular/core";
import { DataProcessingService } from "./data-processing.service";
import type { Username } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class SearchBarService {
	constructor() {
		this.getUsernames();
	}
	private dataService = inject(DataProcessingService);
	public readonly usernames = signal<Username[]>([]);
	getUsernames() {
		this.dataService.getUsernames().subscribe((result) => {
			this.usernames.set(result);
		});
	}
}
