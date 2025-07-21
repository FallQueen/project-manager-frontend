import { Component, inject, signal } from "@angular/core";
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
import type { NameListItem, NameListItemByRole } from "../../model/format.type";

@Component({
	selector: "app-user-selector",
	imports: [DragDropModule, CdkDropListGroup, CdkDropList, CdkDrag],
	templateUrl: "./user-selector.component.html",
	styleUrl: "./user-selector.component.css",
	providers: [SearchBarService],
})
export class UserSelectorComponent {
	searchBarService = inject(SearchBarService);
	dataService = inject(DataProcessingService);
	fullUserRoleList = signal<NameListItemByRole[]>([]);

	ngOnInit() {
		this.dataService.getUsernames().subscribe((result) => {
			this.searchBarService.nameList.set(result);
		});
		this.dataService.getUserProjectRoles(1).subscribe((result) => {
			this.fullUserRoleList.set(result);
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
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
		}
	}
}
