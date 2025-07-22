import { Component, EventEmitter, inject, Output, signal } from "@angular/core";
import { SearchBarService } from "../../service/search-bar.service";
import { DataProcessingService } from "../../service/data-processing.service";
import {
	CdkDrag,
	type CdkDragDrop,
	CdkDropList,
	CdkDropListGroup,
	DragDropModule,
	moveItemInArray,
	transferArrayItem,
} from "@angular/cdk/drag-drop";
import type {
	NameListItem,
	NameListItemByRole,
	UserRoleChange,
} from "../../model/format.type";
import { FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
	selector: "app-user-selector",
	imports: [
		DragDropModule,
		CdkDropListGroup,
		CdkDropList,
		CdkDrag,
		FormsModule,
		MatTooltipModule,
	],
	templateUrl: "./user-selector.component.html",
	styleUrl: "./user-selector.component.css",
	providers: [SearchBarService],
})
export class UserSelectorComponent {
	searchBarService = inject(SearchBarService);
	dataService = inject(DataProcessingService);
	@Output() fullUserRoleListOut = new EventEmitter<NameListItemByRole[]>();
	fullUserRoleList = signal<NameListItemByRole[]>([]);
	fullUserRoleListMemory!: NameListItemByRole[];
	test = this.searchBarService.filteredNameList;

	ngOnInit() {
		this.dataService.getUserProjectRoles(0).subscribe((result) => {
			this.fullUserRoleList.set(result);
			this.fullUserRoleListMemory = JSON.parse(
				JSON.stringify(this.fullUserRoleList()),
			);
		});

		this.dataService.getUsernames().subscribe((result) => {
			this.searchBarService.nameList.set(result);
		});
	}
	drop(event: CdkDragDrop<NameListItem[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
		} else {
			const targetArray = event.container.data;
			const itemToCopy = event.previousContainer.data[event.previousIndex];
			if (event.previousContainer.id === "master-list") {
				if (!this.hasDuplicate(targetArray, itemToCopy)) {
					// If no duplicate, copy the item to the target array.
					targetArray.splice(event.currentIndex, 0, itemToCopy);
				}
			} else if (event.container.id === "master-list") {
				event.previousContainer.data.splice(event.previousIndex, 1);
			} else {
				if (!this.hasDuplicate(targetArray, itemToCopy)) {
					transferArrayItem(
						event.previousContainer.data,
						event.container.data,
						event.previousIndex,
						event.currentIndex,
					);
				}
			}
		}
	}

	hasDuplicate(
		targetArray: NameListItem[],
		itemToCheck: NameListItem,
	): boolean {
		return targetArray.some((item) => item.id === itemToCheck.id);
	}

	removeOverlaps(a: NameListItem[], b: NameListItem[]): NameListItem[] {
		const idsToRemove = new Set(b.map((item) => item.id));

		return a.filter((itemFromA) => !idsToRemove.has(itemFromA.id));
	}

	getDifferenceAsIds(a: NameListItem[], b: NameListItem[]): number[] {
		const idsInB = new Set(b.map((item) => item.id));
		const differenceArray = a.filter((itemFromA) => !idsInB.has(itemFromA.id));
		return differenceArray.map((item) => item.id);
	}

	getArrayChanges(
		roleIdIn: number,
		memory: NameListItem[],
		newState: NameListItem[],
	): UserRoleChange {
		return {
			roleId: roleIdIn,
			usersAdded: this.getDifferenceAsIds(newState, memory),
			usersRemoved: this.getDifferenceAsIds(memory, newState),
		};
	}

	getCurrentArrayChanges() {
		const currentArrayChange: UserRoleChange[] = [];
		let i = 0;
		for (const roleUsers of this.fullUserRoleList()) {
			console.log(`Role ID: ${roleUsers.roleId}, Users:`, roleUsers.users);
			console.log(
				`Role ID: ${roleUsers.roleId}, Users from memory:`,
				this.fullUserRoleListMemory[i].users,
			);

			const change = this.getArrayChanges(
				roleUsers.roleId,
				this.fullUserRoleListMemory[i].users,
				roleUsers.users,
			);
			currentArrayChange.push(change);
			i++;
		}
		console.log(currentArrayChange);
		return currentArrayChange;
	}

	getPic(): number {
		const memoryList = this.fullUserRoleListMemory;
		const currentList = this.fullUserRoleList();

		// Safely get the ID of the current PIC using optional chaining.
		// It will be the ID number or 'undefined' if any part of the path doesn't exist.
		const currentPicId = currentList?.[0]?.users?.[0]?.id;

		// Safely get the ID of the PIC from memory.
		const memoryPicId = memoryList?.[0]?.users?.[0]?.id;

		// Compare the two IDs.
		if (currentPicId === memoryPicId) {
			// If they are the same (including both being undefined),
			// it means there's no change to the PIC. Return 0.
			return 0;
		}
		return currentPicId || 0;
	}
}
