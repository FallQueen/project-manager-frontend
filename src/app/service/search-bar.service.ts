import { effect, inject, Injectable, signal, Injector } from "@angular/core";
import type { NameListItem } from "../model/format.type";

@Injectable()
export class SearchBarService {
	constructor() {
		effect(() => {
			const nameInput = this.nameInput();
			const nameList = this.nameList();
			const filteredList = this.filter(nameInput, nameList);
			this.filteredNameList.set(this.removeDuplicates(filteredList));
		});
	}

	public readonly nameInput = signal<string>("");
	public readonly filteredNameList = signal<NameListItem[]>([]);
	public nameList = signal<NameListItem[]>([]);

	filter(search: string, origin: NameListItem[]): NameListItem[] {
		if (typeof search !== "string") {
			return origin;
		}

		return origin.filter((item) =>
			item.name.toLowerCase().includes(search.toLowerCase()),
		);
	}

	triggerManualFilter() {
		const filteredList = this.filter(this.nameInput(), this.nameList());
		this.filteredNameList.set(filteredList);
	}
	removeDuplicates(list: NameListItem[]): NameListItem[] {
		const uniqueMap = new Map<number, NameListItem>();
		for (const item of list) {
			if (!uniqueMap.has(item.id)) {
				uniqueMap.set(item.id, item);
			}
		}
		return Array.from(uniqueMap.values());
	}
}
