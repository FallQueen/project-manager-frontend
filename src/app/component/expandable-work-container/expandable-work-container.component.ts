import {
	Component,
	computed,
	type ElementRef,
	EventEmitter,
	Input,
	Output,
	type Signal,
	signal,
	ViewChild,
} from "@angular/core";
import type { NameListItem, WorkData } from "../../model/format.type";
import { CardWorkComponent } from "../card-work/card-work.component";
import { CardWorkNewComponent } from "../card-work-new/card-work-new.component";
import { delay } from "rxjs";

@Component({
	selector: "app-expandable-work-container",
	imports: [CardWorkComponent, CardWorkNewComponent],
	templateUrl: "./expandable-work-container.component.html",
	styleUrl: "./expandable-work-container.component.css",
})
export class ExpandableWorkContainerComponent {
	@Input() isExpanded = signal(false);
	@Input() workList = signal<WorkData[]>([]);
	@Input() indicatorClass = "";
	@Input() backlogId = 0;
	@Output() newWorkState = new EventEmitter<NameListItem>();
	workHovered = signal<boolean>(false);

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
}
