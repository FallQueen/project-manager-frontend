import {
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
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
	selector: "app-selector-user-project-role",
	imports: [
		DragDropModule,
		CdkDropListGroup,
		CdkDropList,
		CdkDrag,
		FormsModule,
		MatTooltipModule,
	],
	templateUrl: "./selector-user-project-role.component.html",
	styleUrl: "./selector-user-project-role.component.css",
	providers: [SearchBarService],
})
export class SelectorUserProjectRoleComponent {
	searchBarService = inject(SearchBarService);
	dataService = inject(DataProcessingService);
	fullUserRoleList = signal<NameListItemByRole[]>([]);
	fullUserRoleListMemory!: NameListItemByRole[];
	@Input() editable = false;
	@Input() newProject = false;
	@Input() projectId = 0;
	@Input() projectPicName = "";
	@Output() newPic = new EventEmitter<NameListItem>();
	currentPic = signal<NameListItem>({ name: "", id: 0 });

	ngOnInit() {
		forkJoin({
			roles: this.dataService.getUserProjectRoles(this.projectId),
			users: this.dataService.getUsernames(),
		}).subscribe(({ roles, users }) => {
			// Both calls are now complete. It's safe to set state.
			this.searchBarService.nameList.set(users);
			this.fullUserRoleList.set(roles);

			// Create a deep copy for memory/comparison logic
			this.fullUserRoleListMemory = JSON.parse(
				JSON.stringify(this.fullUserRoleList()),
			);
			if (this.projectPicName !== "") {
				this.movePicFront(this.projectPicName, 1);
			}

			// Now that all data is loaded, check if we need to set the PIC.
			if (this.newProject) {
				this.setCurrentUserAsPic();
			}
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
			const previousContainer = event.previousContainer.data;
			const targetArray = event.container.data;
			const itemToCopy = event.previousContainer.data[event.previousIndex];

			if (
				previousContainer.length <= 1 &&
				event.previousContainer.id === "role-1"
			) {
				return;
			}

			if (event.previousContainer.id === "master-list") {
				if (!this.hasDuplicate(targetArray, itemToCopy)) {
					// If no duplicate, copy the item to the target array.
					targetArray.splice(event.currentIndex, 0, itemToCopy);
				}
			} else if (event.container.id === "master-list") {
				previousContainer.splice(event.previousIndex, 1);
			} else {
				if (!this.hasDuplicate(targetArray, itemToCopy)) {
					transferArrayItem(
						previousContainer,
						targetArray,
						event.previousIndex,
						event.currentIndex,
					);
				}
			}
		}
		if (
			event.container.id === "role-1" ||
			event.previousContainer.id === "role-1"
		) {
			this.picChange(); // Call the specific function for this change.
		}
		if (
			event.container.id === "role-1" ||
			event.previousContainer.id === "role-1"
		) {
			this.picChange();
		}
	}

	picChange() {
		const potentialPic = this.fullUserRoleList()?.[0]?.users?.[0];
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
			const change = this.getArrayChanges(
				roleUsers.roleId,
				this.fullUserRoleListMemory[i].users,
				roleUsers.users,
			);
			currentArrayChange.push(change);
			i++;
		}
		return currentArrayChange;
	}

	setCurrentUserAsPic() {
		const tempUserId = Number(this.dataService.getUserId());
		if (!tempUserId) return;
		const newPic = this.searchBarService
			.nameList()
			.find((user) => user.id === tempUserId);
		if (!newPic) return;
		this.fullUserRoleList()[0].users.unshift(newPic);
		this.picChange();
	}

	movePicFront(picName: string, roleId: number) {
		const users = this.fullUserRoleList()[roleId - 1].users;
		const picIndex = users.findIndex(
			(user) => user.name === this.projectPicName,
		);
		if (picIndex > 0) {
			const [pic] = users.splice(picIndex, 1);
			users.unshift(pic);
		}
	}
}
