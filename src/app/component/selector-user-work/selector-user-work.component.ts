import {
	Component,
	EventEmitter,
	inject,
	Injector,
	Input,
	Output,
	signal,
} from "@angular/core";
import { SearchService } from "../../service/search.service";
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
import type { NameListItem } from "../../model/format.type";
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
	providers: [SearchService],
})
export class SelectorUserWorkComponent {
	searchBarService = inject(SearchService);
	dataService = inject(DataProcessingService);
	userAssignmentList = signal<NameListItem[]>([]);
	injector = inject(Injector);
	UserAssignmentMemory: NameListItem[] = [];
	@Input() editable = false;
	@Input() newWork = false;
	@Input() setUserAsPic = false;
	@Input() workId = 0;
	@Input() workPicName = "";
	@Input() workActivity = 0;
	@Output() newPic = new EventEmitter<NameListItem>();
	@Output() userAssignmentEmpty = new EventEmitter<boolean>();
	currentPic = signal<NameListItem>({ name: "", id: 0 });

	ngOnInit() {
		if (this.newWork) {
			return;
		}

		const roleId = this.checkActivity(this.workActivity);
		forkJoin({
			assignment: this.dataService.getWorkUserAssignment(this.workId),
			users: this.dataService.getProjectAssignedUsernames(
				this.dataService.getProjectId(),
				roleId,
			),
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

			this.removeOverlaps();
		});
	}

	checkActivity(activity: number): number {
		let roleId = 0;
		if (activity === 1) {
			roleId = 2; // RoleId 2 = Developer
		} else if (activity === 2) {
			roleId = 3; // RoleId 3 = Designer
		}

		return roleId;
	}
	initProjectUsers(activity: number) {
		// ActivityId 1 = Development,  2 = Design
		const roleId = this.checkActivity(activity);
		this.dataService
			.getProjectAssignedUsernames(this.dataService.getProjectId(), roleId)
			.subscribe((users) => {
				this.searchBarService.nameList.set(users);
			});
		this.userAssignmentList.set([]);
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
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
			this.searchBarService.triggerManualFilter();
		}

		this.userAssignmentEmpty.emit(this.userAssignmentList().length === 0);

		this.picChange();
	}

	picChange() {
		const potentialPic = this.userAssignmentList()[0];
		if (potentialPic && potentialPic.id !== this.currentPic().id) {
			this.currentPic.set(potentialPic);
			this.newPic.emit(potentialPic);
		} else if (this.userAssignmentList().length === 0) {
			this.currentPic.set({ name: "", id: 0 });
			this.newPic.emit({ name: "", id: 0 });
		}
	}

	removeOverlaps() {
		const idsToRemove = new Set(
			this.userAssignmentList().map((item) => item.id),
		);

		this.searchBarService.nameList.set(
			this.searchBarService
				.nameList()
				.filter((itemFromExisting) => !idsToRemove.has(itemFromExisting.id)),
		);
	}

	getDifferenceAsIds(a: NameListItem[], b: NameListItem[]): number[] {
		const idsInB = new Set(b.map((item) => item.id));
		const differenceArray = a.filter((itemFromA) => !idsInB.has(itemFromA.id));
		return differenceArray.map((item) => item.id);
	}

	getArrayChanges(): { usersAdded: number[]; usersRemoved: number[] } {
		const memory = this.UserAssignmentMemory;
		const current = this.userAssignmentList();
		return {
			usersAdded: this.getDifferenceAsIds(current, memory),
			usersRemoved: this.getDifferenceAsIds(memory, current),
		};
	}

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
