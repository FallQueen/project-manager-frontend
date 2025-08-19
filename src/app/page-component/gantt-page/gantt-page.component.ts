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
	// data
	svc = inject(GanttPageService);
	ganttData = this.svc.ganttData;

	// timeline signals
	timelineStartDate = signal<Date>(new Date());
	timelineEndDate = signal<Date>(new Date());
	totalDays = signal(0);
	todaysIndex = signal<number | null>(null);
	timeline = signal<TimelineMonth[]>([]);
	todayPosition = signal<number | null>(null);

	// view refs
	@ViewChildren("dayCell") dayCells!: QueryList<ElementRef<HTMLDivElement>>;
	@ViewChild("ganttScroll") ganttScrollRef!: ElementRef<HTMLDivElement>;

	// flags
	viewInitialized = false;
	scrolledToToday = false;

	// drag scroll state
	isDragging = false;
	dragStartX = 0;
	dragStartY = 0;
	scrollStartX = 0;
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
		if (e.button !== 0) return;
		const t = e.target as HTMLElement | null;
		if (t?.closest("input, textarea, button, select, .no-scroll, .gantt-bar"))
			return;
		this.isDragging = true;
		this.dragStartX = e.clientX;
		this.dragStartY = e.clientY;
		this.scrollStartX = this.container?.scrollLeft || 0;
		this.scrollStartY = this.container?.scrollTop || 0;
		document.body.style.userSelect = "none";
	};
	onDragMove = (e: MouseEvent) => {
		if (!this.isDragging || !this.container) return;
		this.container.scrollLeft =
			this.scrollStartX - (e.clientX - this.dragStartX);
		this.container.scrollTop =
			this.scrollStartY - (e.clientY - this.dragStartY);
	};
	onDragEnd = () => {
		if (!this.isDragging) return;
		this.isDragging = false;
		document.body.style.userSelect = "";
	};

	// react to data changes
	constructor() {
		effect(() => {
			const data = this.ganttData();
			if (data && typeof data === "object" && "projectDates" in data) {
				this.buildTimeline();
				this.updateTodayMarker();
			} else this.resetTimeline();
		});
	}

	// helpers
	get container() {
		return this.ganttScrollRef?.nativeElement || null;
	}
	clamp(v: number, min: number, max: number) {
		return Math.max(min, Math.min(max, v));
	}

	tryScrollTodayIntoView() {
		if (this.scrolledToToday || !this.viewInitialized || !this.container)
			return;
		const idx = this.todaysIndex();
		if (idx == null) return;
		const allDays = this.timeline().flatMap((m) => m.days);
		const cellWrapper = this.dayCells.find(
			(_, i) => allDays[i]?.globalIndex === idx,
		);
		if (!cellWrapper) return;
		const el = cellWrapper.nativeElement;
		if (!el.offsetWidth) {
			setTimeout(() => this.tryScrollTodayIntoView(), 50);
			return;
		}
		const leftPanel = this.container.querySelector(
			".work-data-section",
		) as HTMLElement | null;
		const targetCenter = el.offsetLeft + el.offsetWidth / 2;
		const leftWidth = leftPanel?.offsetWidth || 0;
		const fudge = -200;
		let desired =
			targetCenter - this.container.clientWidth / 2 - leftWidth / 2 - fudge;
		desired = this.clamp(
			desired,
			0,
			this.container.scrollWidth - this.container.clientWidth,
		);
		this.container.scrollLeft = desired;
		this.scrolledToToday = true;
	}

	resetTimeline() {
		this.totalDays.set(0);
		this.timeline.set([]);
		this.todayPosition.set(null);
	}

	// Calculates the overall project start and end dates to establish the timeline range.

	buildTimeline() {
		const data = this.ganttData() as {
			projectDates?: {
				oldestStartDate: Date | string;
				newestTargetDate: Date | string;
			};
		} | null;
		if (!data?.projectDates) {
			this.resetTimeline();
			return;
		}
		this.scrolledToToday = false;
		const rawStart = new Date(data.projectDates.oldestStartDate);
		const rawEnd = new Date(data.projectDates.newestTargetDate);
		const start = new Date(rawStart.getFullYear(), rawStart.getMonth(), 1);
		const end = new Date(rawEnd.getFullYear(), rawEnd.getMonth() + 1, 0);
		this.timelineStartDate.set(start);
		this.timelineEndDate.set(end);
		const daysTotal = this.daysBetween(start, end) + 1;
		this.totalDays.set(daysTotal);
		const todayIdx = this.daysBetween(start, new Date());
		this.todaysIndex.set(
			todayIdx >= 0 && todayIdx < daysTotal ? todayIdx : null,
		);
		const months: TimelineMonth[] = [];
		const cur = new Date(start);
		let i = 0;
		while (cur <= end) {
			const label = cur.toLocaleString("default", { month: "long" });
			const yr = cur.getFullYear();
			let m = months.find((x) => x.monthName === label && x.year === yr);
			if (!m) {
				m = { monthName: label, year: yr, days: [] };
				months.push(m);
			}
			m.days.push({ monthDay: cur.getDate(), globalIndex: i });
			cur.setDate(cur.getDate() + 1);
			i++;
		}
		this.timeline.set(months);
	}

	updateTodayMarker() {
		const today = new Date();
		this.todayPosition.set(
			today >= this.timelineStartDate() && today <= this.timelineEndDate()
				? this.daysBetween(this.timelineStartDate(), today)
				: null,
		);
	}

	// Helper function to calculate the number of days between two dates.
	// @param date1 The first date.
	// @param date2 The second date.
	// @returns The total number of full days between the two dates.
	daysBetween(date1: Date, date2: Date): number {
		// 24 h * 60 min * 60 s * 1000 ms
		const oneDay = 24 * 60 * 60 * 1000;
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		// Zero out to compare date portions only
		d1.setHours(0, 0, 0, 0);
		d2.setHours(0, 0, 0, 0);
		const diffTime = d2.getTime() - d1.getTime();
		return Math.round(diffTime / oneDay);
	}

	// Calculates the width percentage of a work item in the Gantt chart.
	// @param w The work item to calculate the width for.
	// @returns The width percentage as a string (e.g., "50%").
	calculateGanttBarWidth(startDate: Date, targetDate: Date): string {
		return `${(this.daysBetween(startDate, targetDate) / this.totalDays()) * 100}%`;
	}
	calculateGanttBarStart(startDate: Date): string {
		return `${(this.daysBetween(this.timelineStartDate(), startDate) / this.totalDays()) * 100}%`;
	}

	calculateTodayLineLocation(): string {
		const offset = 8; // px
		const percent = ((this.todaysIndex() || 0) / this.totalDays()) * 100;
		return `calc(${percent}% + ${offset}px)`;
	}

	getUserListAsString(users: NameListItem[]) {
		return users.map((u) => u.name).join(", ");
	}

	// --- GANTT BAR DRAG (HORIZONTAL SNAP) ---
	barDragInfo: {
		workId: number;
		origStartPx: number;
		origStartDayIndex: number;
		barWidthPx: number;
		dayWidthPx: number;
		pointerOffsetInBar: number;
		bodyLeft: number;
		lastLeftPx: number;
	} | null = null;

	onBarPointerDown(e: PointerEvent, work: GanttItem) {
		// Only primary button
		if (e.button !== 0) return;
		const container = this.container;
		if (!container) return;
		// Prevent container drag scroll while resizing
		container.classList.add("bar-drag-active");
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		const bodyEl = container.querySelector(".gantt-body") as HTMLElement | null;
		const totalWidthPx = bodyEl?.clientWidth || container.clientWidth;
		const dayWidthPx = totalWidthPx / this.totalDays();
		// Use actual rendered bar position instead of computed index*dayWidth to avoid rounding jumps
		const barEl = (e.target as HTMLElement).closest(
			".gantt-bar",
		) as HTMLElement | null;
		if (!barEl || !bodyEl) return;
		const barRect = barEl.getBoundingClientRect();
		const bodyRect = bodyEl.getBoundingClientRect();
		const origStartPx = barRect.left - bodyRect.left;
		const origStartDayIndex = this.daysBetween(
			this.timelineStartDate(),
			work.startDate,
		);
		const barWidthPx =
			this.daysBetween(work.startDate, work.targetDate) * dayWidthPx;
		const pointerOffsetInBar = e.clientX - barRect.left;
		this.barDragInfo = {
			workId: work.workId,
			origStartPx,
			origStartDayIndex,
			barWidthPx,
			dayWidthPx,
			pointerOffsetInBar,
			bodyLeft: bodyRect.left,
			lastLeftPx: origStartPx,
		};
		e.preventDefault();
	}

	onBarPointerMove(e: PointerEvent, work: GanttItem) {
		if (!this.barDragInfo || this.barDragInfo.workId !== work.workId) return;
		const info = this.barDragInfo;
		// Desired left edge = pointer - bodyLeft - pointerOffsetInBar
		let newLeftPx = e.clientX - info.bodyLeft - info.pointerOffsetInBar;
		newLeftPx = this.clamp(
			newLeftPx,
			0,
			this.totalDays() * info.dayWidthPx - info.barWidthPx,
		);
		info.lastLeftPx = newLeftPx;
		const barEl = (e.target as HTMLElement).closest(
			".gantt-bar",
		) as HTMLElement | null;
		if (barEl) {
			barEl.style.transform = `translateX(${newLeftPx - info.origStartPx}px)`;
			barEl.style.willChange = "transform";
		}
	}

	onBarPointerUp(e: PointerEvent, work: GanttItem) {
		if (!this.barDragInfo || this.barDragInfo.workId !== work.workId) return;
		const info = this.barDragInfo;
		const container = this.container;
		const finalBar = (e.target as HTMLElement).closest(
			".gantt-bar",
		) as HTMLElement | null;
		const newLeftPx = info.lastLeftPx; // already clamped
		let snappedIndex = Math.round(newLeftPx / info.dayWidthPx);
		snappedIndex = this.clamp(snappedIndex, 0, this.totalDays() - 1);
		const snappedPct = (snappedIndex / this.totalDays()) * 100;
		if (finalBar) {
			finalBar.style.transform = "";
			finalBar.style.willChange = "";
			finalBar.style.marginLeft = `${snappedPct}%`;
		}
		const movedDays = snappedIndex - info.origStartDayIndex;
		console.log("Bar drag finished:", { workId: work.workId, movedDays });
		// Cleanup
		this.barDragInfo = null;
		if (container) container.classList.remove("bar-drag-active");
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	}
}
