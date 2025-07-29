import {
	Component,
	computed,
	effect,
	EventEmitter,
	inject,
	Injector,
	Input,
	Output,
	type Signal,
	signal,
} from "@angular/core";
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
import { forkJoin } from "rxjs";

@Component({
	selector: "app-selector-user-work",
	imports: [
		DragDropModule,
		CdkDropListGroup,
		CdkDropList,
		CdkDrag,
		FormsModule,
		MatTooltipModule,
	],
	templateUrl: "./selector-user-work.component.html",
	styleUrl: "./selector-user-work.component.css",
	providers: [SearchBarService],
})
export class SelectorUserWorkComponent {
	searchBarService = inject(SearchBarService);
	dataService = inject(DataProcessingService);
	userAssignmentList = signal<NameListItem[]>([]);
	injector = inject(Injector);
	UserAssignmentMemory!: NameListItem[];
	@Input() editable = false;
	@Input() newWork = false;
	@Input() setUserAsPic = false;
	@Input() workId = 0;
	@Input() workPicName = "";
	@Output() newPic = new EventEmitter<NameListItem>();
	currentPic = signal<NameListItem>({ name: "", id: 0 });

	ngOnInit() {
		if (this.newWork) {
			return;
		}

		forkJoin({
			assignment: this.dataService.getWorkUserAssignment(this.workId),
			users: this.dataService.getUsernames(),
		}).subscribe(({ assignment, users }) => {
			this.searchBarService.nameList.set(users);
			this.userAssignmentList.set(assignment);

			// Create a deep copy for memory/comparison logic
			this.UserAssignmentMemory = JSON.parse(
				JSON.stringify(this.userAssignmentList()),
			);
			if (this.workPicName !== "") {
				this.movePicFront(this.workPicName);
			}

			// Now that all data is loaded, check if we need to set the PIC.
			if (this.newWork) {
				this.setCurrentUserAsPic();
			}
		});
	}

	initProjectUsers(activity: number) {
		// ActivityId 1 = Development,  2 = Design
		let roleId = 0;
		if (activity === 1) {
			roleId = 2; // RoleId 2 = Developer
		} else if (activity === 2) {
			roleId = 3; // RoleId 3 = Designer
		} else {
			return;
		}
		this.dataService
			.getProjectAssignedUsernames(this.dataService.getprojectId(), roleId)
			.subscribe((users) => {
				this.searchBarService.nameList.set(users);
			});
		if (this.setUserAsPic) {
			this.setCurrentUserAsPic();
		}
		return;
	}

	drop(event: CdkDragDrop<NameListItem[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
		} else {
			const previousContainer = event.previousContainer.data;
			const targetArray = event.container.data;
			const itemToCopy = event.previousContainer.data[event.previousIndex];
			transferArrayItem(
				previousContainer,
				targetArray,
				event.previousIndex,
				event.currentIndex,
			);
			this.searchBarService.triggerManualFilter();
			// if (
			// 	previousContainer.length <= 1 &&
			// 	event.previousContainer.id === "role-1"
			// ) {
			// 	return;
			// }

			// if (event.previousContainer.id === "master-list") {
			// 	if (!this.hasDuplicate(targetArray, itemToCopy)) {
			// 		// If no duplicate, copy the item to the target array.
			// 		targetArray.splice(event.currentIndex, 0, itemToCopy);
			// 	}
			// } else if (event.container.id === "master-list") {
			// 	previousContainer.splice(event.previousIndex, 1);
			// } else {
			// 	if (!this.hasDuplicate(targetArray, itemToCopy)) {
			// 		transferArrayItem(
			// 			previousContainer,
			// 			targetArray,
			// 			event.previousIndex,
			// 			event.currentIndex,
			// 		);
			// 	}
			// }
		}
		this.picChange();
	}

	picChange() {
		const potentialPic = this.userAssignmentList()[0];
		if (potentialPic && potentialPic.id !== this.currentPic().id) {
			this.currentPic.set(potentialPic);
			this.newPic.emit(potentialPic);
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
	): { usersAdded: number[]; usersRemoved: number[] } {
		return {
			usersAdded: this.getDifferenceAsIds(newState, memory),
			usersRemoved: this.getDifferenceAsIds(memory, newState),
		};
	}

	// getCurrentArrayChanges() {
	// 	const currentArrayChange: UserRoleChange[] = [];
	// 	let i = 0;
	// 	for (const roleUsers of this.fullUserRoleList()) {
	// 		const change = this.getArrayChanges(
	// 			roleUsers.roleId,
	// 			this.fullUserRoleListMemory[i].users,
	// 			roleUsers.users,
	// 		);
	// 		currentArrayChange.push(change);
	// 		i++;
	// 	}
	// 	return currentArrayChange;
	// }

	setCurrentUserAsPic() {
		const tempUserId = Number(this.dataService.getUserId());
		if (!tempUserId) return;
		const newPic = this.searchBarService
			.nameList()
			.find((user) => user.id === tempUserId);
		if (!newPic) return;
		this.userAssignmentList().unshift(newPic);
		this.picChange();
	}

	movePicFront(picName: string) {
		const users = this.userAssignmentList();
		const picIndex = users.findIndex((user) => user.name === this.workPicName);
		if (picIndex > 0) {
			const [pic] = users.splice(picIndex, 1);
			users.unshift(pic);
		}
	}
}
