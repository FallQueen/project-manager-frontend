import { effect, inject, Injectable, signal, Injector } from "@angular/core";
import type { NameListItem } from "../model/format.type";

@Injectable()
export class SearchBarService {
	private injector = inject(Injector);

	constructor() {
		effect(
			() => {
				const nameInput = this.nameInput();
				const nameList = this.nameList();
				const filteredList = this.filter(nameInput, nameList);
				this.filteredNameList.set(filteredList);
			},
			{ injector: this.injector },
		);
	}

	public readonly nameInput = signal<string>("");
	public readonly filteredNameList = signal<NameListItem[]>([]);
	public readonly nameList = signal<NameListItem[]>([]);

	filter(search: string, origin: NameListItem[]): NameListItem[] {
		const filterValue = search.toLowerCase();
		return origin.filter((names) =>
			names.name.toLowerCase().includes(filterValue),
		);
	}

	triggerManualFilter() {
		const filteredList = this.filter(this.nameInput(), this.nameList());
		this.filteredNameList.set(filteredList);
	}
}
