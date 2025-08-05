import {
	Component,
	effect,
	EventEmitter,
	inject,
	Input,
	Output,
	signal,
} from "@angular/core";
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
		class: "priority" | "state" | "period";
		current: NameListItem;
	};
	@Output() dataChange = new EventEmitter<NameListItem>();
	itemList = signal<NameListItem[]>([]);
	visibleItemList = signal<NameListItem[]>([]);
	datepicker = signal<boolean>(false);
	visibility = signal<boolean>(false);

	constructor() {
		effect(() => {
			if (this.popUpData.class === "priority") {
				this.itemList.set(this.dataService.getPriorityList()());
			} else if (this.popUpData.class === "state") {
				this.itemList.set(this.dataService.getStateList()());
			}
			this.setVisibleItemList();
		});
	}

	ngOnChanges() {
		if (this.popUpData) {
			this.setVisibleItemList();
		}
	}

	setVisibleItemList() {
		if (this.popUpData.class === "state") {
			const currentId = this.popUpData.current.id;
			this.visibleItemList.set(
				this.itemList().filter((item) => {
					return (
						item.id < currentId + 2 && item.id > currentId - 2 && item.id !== 1
					);
				}),
			);
		} else {
			this.visibleItemList.set(this.itemList());
		}
	}

	pickItem(item: NameListItem) {
		this.dataChange.emit(item);
	}

	toggleVisibility() {
		console.log("current", this.popUpData.current.name);
		if (this.popUpData.current.name !== "NEW") {
			this.visibility.set(!this.visibility());
		}
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
