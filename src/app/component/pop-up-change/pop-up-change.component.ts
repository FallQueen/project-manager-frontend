import { Component, inject, Input, signal } from "@angular/core";
import type { NameListItem } from "../../model/format.type";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-pop-up-change",
	imports: [],
	templateUrl: "./pop-up-change.component.html",
	styleUrl: "./pop-up-change.component.css",
})
export class PopUpChangeComponent {
	dataService = inject(DataProcessingService);
	@Input() popUpData!: {
		workId: number;
		class: "priority" | "state" | "period";
		current: NameListItem;
	};
	itemList = signal<NameListItem[]>([]);
	datepicker = signal<boolean>(false);
	visibility = signal<boolean>(false);

	ngOnInit() {
		if (this.popUpData.class === "priority") {
			this.itemList.set(this.dataService.getPriorityList());
		} else if (this.popUpData.class === "state") {
			this.itemList.set(this.dataService.getStateList());
		}
	}

	pickItem(item: NameListItem) {
		if (this.popUpData.class === "priority") {
			this.dataService.putAlterWork({
				workId: this.popUpData.workId,
				priorityId: item.id,
			});
		} else if (this.popUpData.class === "state") {
			this.dataService.putAlterWork({
				workId: this.popUpData.workId,
				currentState: item.id,
			});
		} else if (this.popUpData.class === "period") {
			this.datepicker.set(true);
		}
	}

	toggleVisibility() {
		this.visibility.set(!this.visibility());
	}

	ngAfterViewInit() {
		window.addEventListener("mousedown", this.handleClickOutside);
	}

	ngOnDestroy() {
		window.removeEventListener("mousedown", this.handleClickOutside);
	}

	handleClickOutside = (event: MouseEvent) => {
		const popupElement = document.querySelector("app-pop-up-change");
		if (popupElement && !popupElement.contains(event.target as Node)) {
			this.visibility.set(false);
		}
	};
}
