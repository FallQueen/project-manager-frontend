import { CommonModule } from "@angular/common";
import {
	Component,
	effect,
	type ElementRef,
	inject,
	type QueryList,
	signal,
	ViewChild,
	ViewChildren,
} from "@angular/core";
import type {
	NameListItem,
	GanttItem,
	TimelineMonth,
} from "../../model/format.type";
import { GanttPageService } from "../../service/gantt-page.service";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
	selector: "app-gantt-page",
	imports: [CommonModule, MatGridListModule, MatTooltipModule],
	templateUrl: "./gantt-page.component.html",
	styleUrl: "./gantt-page.component.css",
})
export class GanttPageComponent {
	ganttPageService = inject(GanttPageService);
	// Input property to receive project data from a parent component, now using the new types
	ganttData = this.ganttPageService.ganttData;

	// --- TIMELINE PROPERTIES ---
	// These properties will be calculated to build the chart's timeline
	timelineStartDate = signal<Date>(new Date());
	timelineEndDate = signal<Date>(new Date());
	totalDays = signal(0);
	todaysIndex = signal<number | null>(null);
	timeline = signal<TimelineMonth[]>([]);
	todayPosition = signal<number | null>(null);
	@ViewChildren("dayCell") dayCells!: QueryList<ElementRef<HTMLDivElement>>;
	@ViewChild("ganttScroll") ganttScrollRef!: ElementRef<HTMLDivElement>;

	viewInitialized = false;
	scrolledToToday = false;

	// --- DRAG TO SCROLL ---
	isDragging = false;
	dragStartX = 0;
	scrollStartX = 0;
	dragStartY = 0;
	scrollStartY = 0;

	ngAfterViewInit() {
		this.viewInitialized = true;
		// Drag-to-scroll listeners
		const container = this.ganttScrollRef
			?.nativeElement as HTMLDivElement | null;
		if (container) {
			container.addEventListener("mousedown", this.onDragStart);
			container.addEventListener("mousemove", this.onDragMove);
			container.addEventListener("mouseup", this.onDragEnd);
			container.addEventListener("mouseleave", this.onDragEnd);
			// Prevent text selection while dragging
			container.addEventListener("dragstart", (e) => e.preventDefault());
		}
		// React when the query list of day cells changes (e.g., after timeline render)
		this.dayCells.changes.subscribe(() => this.tryScrollTodayIntoView());
		// Initial attempt (next macro/micro task to ensure DOM painted)
		setTimeout(() => this.tryScrollTodayIntoView());
	}

	onDragStart = (e: MouseEvent) => {
		// Only left mouse button
		if (e.button !== 0) return;
		this.isDragging = true;
		this.dragStartX = e.clientX;
		this.dragStartY = e.clientY;
		const container = this.ganttScrollRef
			?.nativeElement as HTMLDivElement | null;
		this.scrollStartX = container ? container.scrollLeft : 0;
		this.scrollStartY = container ? container.scrollTop : 0;
		if (container) container.classList.add("dragging");
		// Prevent text selection
		document.body.style.userSelect = "none";
	};

	onDragMove = (e: MouseEvent) => {
		if (!this.isDragging) return;
		const container = this.ganttScrollRef
			?.nativeElement as HTMLDivElement | null;
		if (!container) return;
		const dx = e.clientX - this.dragStartX;
		const dy = e.clientY - this.dragStartY;
		container.scrollLeft = this.scrollStartX - dx;
		container.scrollTop = this.scrollStartY - dy;
	};

	onDragEnd = (_e: MouseEvent) => {
		if (!this.isDragging) return;
		this.isDragging = false;
		const container = this.ganttScrollRef
			?.nativeElement as HTMLDivElement | null;
		if (container) container.classList.remove("dragging");
		document.body.style.userSelect = "";
	};

	// react to data changes
	constructor() {
		effect(() => {
			const data = this.ganttData();
			console.log("from effect:", this.ganttData()?.ganttItemData);
			// Expected structure: { projectDates: { oldestStartDate: Date|string; newestTargetDate: Date|string } }
			if (data && typeof data === "object" && "projectDates" in data) {
				this.createTimeline();
				this.calculateTodayMarker();
			} else {
				this.resetTimeline();
			}
		});
	}

	// (removed duplicate ngAfterViewInit)

	tryScrollTodayIntoView() {
		if (this.scrolledToToday || !this.viewInitialized) return;
		const index = this.todaysIndex();
		if (index == null) return;
		const allDays = this.timeline().flatMap((m) => m.days);
		if (!allDays.length) return;
		// Find the cell whose globalIndex matches today's index
		const cellWrapper = this.dayCells.find(
			(_, i) => allDays[i]?.globalIndex === index,
		);
		const container = this.ganttScrollRef?.nativeElement;
		if (!cellWrapper || !container) return;
		const cellEl = cellWrapper.nativeElement;
		// If cell hasn't been laid out yet (width 0), try later
		if (!cellEl.offsetWidth) {
			setTimeout(() => this.tryScrollTodayIntoView(), 50);
			return;
		}
		const cellOffset = cellEl.offsetLeft; // relative to scroll container content
		const targetCenter = cellOffset + cellEl.offsetWidth / 2;
		// Width of the left (sticky) panel so we center within the timeline portion, not whole container
		const leftPanel: HTMLElement | null =
			container.querySelector(".work-data-section");
		const leftWidth = leftPanel ? leftPanel.offsetWidth : 0;
		// Optional tweak to bias a bit more center/right if desired
		const fudge = -200; // increase (e.g. 40) if you want today slightly right of true center
		// Current formula centers cell in full container; adjust by half of left panel width so it's centered in timeline area
		let newScrollLeft =
			targetCenter - container.clientWidth / 2 - leftWidth / 2 - fudge;
		newScrollLeft = Math.max(
			0,
			Math.min(newScrollLeft, container.scrollWidth - container.clientWidth),
		);
		// Use smooth scroll when supported
		try {
			container.scrollTo({ left: newScrollLeft, behavior: "instant" });
		} catch {
			container.scrollLeft = newScrollLeft;
		}
		// Focus the cell for accessibility/keyboard navigation
		this.scrolledToToday = true; // prevent further automatic scrolling
	}

	resetTimeline() {
		this.totalDays.set(0);
		this.timeline.set([]);
		this.todayPosition.set(null);
	}

	// Calculates the overall project start and end dates to establish the timeline range.

	createTimeline() {
		const data = this.ganttData() as {
			projectDates?: {
				oldestStartDate: Date | string;
				newestTargetDate: Date | string;
			};
		} | null;
		if (!data || !data.projectDates) {
			this.resetTimeline();
			return;
		}
		// allow re-scroll when timeline recomputed
		this.scrolledToToday = false;
		// Safely coerce incoming values (could be string or Date)
		const oldestStartDateRaw = data.projectDates.oldestStartDate;
		const newestTargetDateRaw = data.projectDates.newestTargetDate;
		const start = new Date(oldestStartDateRaw);
		const end = new Date(newestTargetDateRaw);

		this.timelineStartDate.set(start);
		this.timelineEndDate.set(end);

		// Normalize to month boundaries (optional: remove if not desired)
		const normalizedStart = new Date(start.getFullYear(), start.getMonth(), 1);
		const normalizedEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0);
		this.timelineStartDate.set(normalizedStart);
		this.timelineEndDate.set(normalizedEnd);

		// Calculate total days (inclusive)
		this.totalDays.set(
			this.daysBetween(this.timelineStartDate(), this.timelineEndDate()) + 1,
		);
		// zero-based index of today relative to timeline start
		const todayIdx = this.daysBetween(this.timelineStartDate(), new Date());
		if (todayIdx >= 0 && todayIdx < this.totalDays()) {
			this.todaysIndex.set(todayIdx);
		} else {
			this.todaysIndex.set(null);
		}

		this.generateTimelineHeaders();
	}

	// Generates the month and day headers for the chart's timeline view.
	generateTimelineHeaders() {
		const timelineArr: TimelineMonth[] = [];
		const currentDate = new Date(this.timelineStartDate());
		let index = 0;
		while (currentDate <= this.timelineEndDate()) {
			const year = currentDate.getFullYear();
			const monthName = currentDate.toLocaleString("default", {
				month: "long",
			});
			let monthObj = timelineArr.find(
				(m) => m.monthName === monthName && m.year === year,
			);
			if (!monthObj) {
				monthObj = { monthName, year, days: [] };
				timelineArr.push(monthObj);
			}
			monthObj.days.push({
				monthDay: currentDate.getDate(),
				globalIndex: index,
			});
			currentDate.setDate(currentDate.getDate() + 1);
			index++;
		}
		this.timeline.set(timelineArr);
	}

	calculateTodayMarker() {
		const today = new Date();
		if (today >= this.timelineStartDate() && today <= this.timelineEndDate()) {
			this.todayPosition.set(this.daysBetween(this.timelineStartDate(), today));
		} else {
			this.todayPosition.set(null);
		}
	}

	// Helper function to calculate the number of days between two dates.
	// @param date1 The first date.
	// @param date2 The second date.
	// @returns The total number of full days between the two dates.
	daysBetween(date1: Date, date2: Date): number {
		const oneDay = 24 * 60 * 60 * 1000;
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		// Zero out to compare date portions only
		d1.setHours(0, 0, 0, 0);
		d2.setHours(0, 0, 0, 0);
		const diffTime = d2.getTime() - d1.getTime();
		return Math.ceil(diffTime / oneDay);
	}

	// Calculates the width percentage of a work item in the Gantt chart.
	// @param w The work item to calculate the width for.
	// @returns The width percentage as a string (e.g., "50%").
	calculateGanttBarWidth(startDate: Date, targetDate: Date): string {
		const width =
			(this.daysBetween(startDate, targetDate) / this.totalDays()) * 100;
		return `${width}%`;
	}

	calculateGanttBarStart(startDate: Date): string {
		const start = this.daysBetween(this.timelineStartDate(), startDate);
		return `${(start / this.totalDays()) * 100}%`;
	}

	calculateTodayLineLocation(): string {
		const offset = 8; // px
		const percent = ((this.todaysIndex() || 0) / this.totalDays()) * 100;
		return `calc(${percent}% + ${offset}px)`;
	}

	getUserListAsString(users: NameListItem[]) {
		return users.map((user) => user.name).join(", ");
	}
}
