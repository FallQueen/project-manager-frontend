import { effect, Injectable, signal } from "@angular/core";
import type { NameListItem, workNameListItem } from "../model/format.type";

@Injectable()
export class SearchService {
	private readonly enableFilterById = signal<boolean>(false);
	// Signal for the current search input
	public readonly nameInput = signal<string>("");
	public readonly textInputFromExistingData = signal<string>("");
	// Signal for the filtered list of names
	public readonly filteredNameList = signal<NameListItem[]>([]);

	// Signal for the original list of names
	public nameList = signal<NameListItem[]>([]);

	constructor() {
		// Automatically update filteredNameList when nameInput or nameList changes
		effect(() => {
			const nameInput = this.nameInput();
			const nameList = this.nameList();
			// Filter the name list based on the current input
			const filteredList = this.filter(nameInput, nameList);

			// Remove duplicates from the filtered list before setting it
			this.filteredNameList.set(this.removeDuplicates(filteredList));
		});
	}

	enableIdFilter() {
		this.enableFilterById.set(true);
	}

	// Filters the origin list by search string.
	// If alsoEnableFilterById is true, also matches by id.
	// @param search The search string to filter by.
	// @param origin The original list of names.
	// @param alsoEnableFilterById Whether to also filter by id.
	// @returns The filtered list of NameListItem.
	filter(
		search: string,
		origin: NameListItem[] | workNameListItem[],
		alsoEnableFilterById = false,
	): NameListItem[] | workNameListItem[] {
		if (typeof search !== "string") {
			// If search is not a string, return the original list
			return origin;
		}

		if (alsoEnableFilterById) {
			// Filter by id or name (case-insensitive)
			return origin.filter(
				(item) =>
					item.id.toString().includes(search) ||
					item.name.toLowerCase().includes(search.toLowerCase()),
			);
		}

		// Filter by name (case-insensitive)
		return origin.filter((item) =>
			item.name.toLowerCase().includes(search.toLowerCase()),
		);
	}

	// Manually triggers filtering and updates filteredNameList.

	triggerManualFilter() {
		const filteredList = this.filter(this.nameInput(), this.nameList());
		this.filteredNameList.set(filteredList);
	}

	// Removes duplicate items from the list based on id.
	// @param list The list to remove duplicates from.
	// @returns A new list with duplicates removed.
	removeDuplicates(list: NameListItem[]): NameListItem[] {
		const uniqueMap = new Map<number, NameListItem>();
		for (const item of list) {
			// Only add item if its id is not already in the map
			if (!uniqueMap.has(item.id)) {
				uniqueMap.set(item.id, item);
			}
		}
		return Array.from(uniqueMap.values());
	}
}
