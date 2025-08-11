import {
	Component,
	computed,
	type ElementRef,
	EventEmitter,
	inject,
	Input,
	Output,
	type Signal,
	signal,
	ViewChild,
} from "@angular/core";
import type { BugData, NameListItem, WorkData } from "../../model/format.type";
import { CardWorkComponent } from "../card-work/card-work.component";
import { CardWorkNewComponent } from "../card-work-new/card-work-new.component";
import { delay } from "rxjs";
import { Router } from "@angular/router";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-expandable-work-container",
	imports: [CardWorkComponent, CardWorkNewComponent],
	templateUrl: "./expandable-work-container.component.html",
	styleUrl: "./expandable-work-container.component.css",
})
export class ExpandableWorkContainerComponent {
	dataService = inject(DataProcessingService);
	router = inject(Router);
	@Input() isExpanded = signal(false);
	@Input() workList = signal<WorkData[] | BugData[]>([]);
	@Input() indicatorClass = "";
	@Input() backlogId = 0;
	@Output() newWorkState = new EventEmitter<NameListItem>();
	@Output() triggerbatteryRefresh = new EventEmitter<void>();
	workHovered = signal<boolean>(false);
	@Input() sectionLabel = signal<string[]>([
		"TRACKER",
		"ACTIVITY",
		"STATE",
		"PRIORITY",
		"PERIOD",
	]);

	ngOnInit() {
		if (this.dataService.isBugData(this.workList()[0])) {
			this.sectionLabel.set([
				"DEFECT CAUSE",
				"AFFECTED WORK",
				"STATE",
				"PRIORITY",
				"PERIOD",
			]);
		}

		if (this.dataService.isPage("dashboard")) {
			this.sectionLabel.set([
				"PROJECT",
				"TRACKER",
				"ACTIVITY",
				"STATE",
				"PRIORITY",
				"PERIOD",
			]);
		}
	}
	@ViewChild("workChildContainer") workChildContainer!: ElementRef;
	workChildContainerHeight: Signal<number> = computed(() => {
		const expanded = this.isExpanded();
		const workHover = this.workHovered();
		const workList = this.workList();
		if (!expanded) return 0;
		if (!this.workChildContainer || !this.workChildContainer.nativeElement)
			return 0;
		let height = 0;
		delay(50);
		height = this.workChildContainer.nativeElement.scrollHeight;

		if (workHover === true && workList.length > 0) height += 70;
		return height;
	});

	isBacklogPage(): boolean {
		return this.router.url.includes("/home/(home:backlog)");
	}

	removeWorkFromArray(workId: number) {
		this.workList.update((list) => list.filter((w) => w.workId !== workId));
		this.triggerbatteryRefresh.emit();
	}
}
