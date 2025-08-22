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
	AlterWork,
} from "../../model/format.type";
import { GanttPageService } from "../../service/gantt-page.service";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GanttFilterComponent } from "../../component/gantt-filter/gantt-filter.component";

@Component({
	selector: "app-gantt-page",
	imports: [
		CommonModule,
		MatGridListModule,
		MatTooltipModule,
		GanttFilterComponent,
	],
	templateUrl: "./gantt-page.component.html",
	styleUrl: "./gantt-page.component.css",
})
export class GanttPageComponent {
	// data
	ganttPageService = inject(GanttPageService);
	ganttData = this.ganttPageService.ganttData;

	// timeline signals
	timelineStartDate = signal<Date>(new Date());
	timelineEndDate = signal<Date>(new Date());
	totalDays = signal(0);
	todaysIndex = signal<number | null>(null);
	timeline = signal<TimelineMonth[]>([]);
	today = signal<Date>(new Date());

	// view refs
	@ViewChildren("dayCell") dayCells!: QueryList<ElementRef<HTMLDivElement>>;
	@ViewChild("ganttScroll") ganttScrollRef!: ElementRef<HTMLDivElement>;

	// drag scroll state
	scrolledToToday = false;
	isDragging = false;
	dragStartX = 0;
	dragStartY = 0;
	scrollStartX = 0;
	scrollStartY = 0;

	barDragInfo: {
		workId: number;
		origStartPx: number; // px offset of bar start from body left
		origStartDayIndex: number; // starting day index (for computing moved days)
		barWidthPx: number; // cached to avoid recalculation
		dayWidthPx: number;
		pointerOffsetInBar: number; // pointer x inside bar when drag began
		bodyLeft: number; // left of body rect (for quick pointer -> px calc)
		lastLeftPx: number; // most recent unsnapped left during live drag
	} | null = null;

	resizeInfo: {
		workId: number;
		side: "left" | "right";
		origStartPx: number;
		origWidthPx: number;
		dayWidthPx: number;
		bodyLeft: number;
		pointerStartX: number;
		minWidthPx: number; // min = 1 day
		lastLeftPx: number;
		lastWidthPx: number;
	} | null = null;

	constructor() {
		effect(() => {
			const data = this.ganttData();
			if (data && typeof data === "object" && "projectDates" in data) {
				this.buildTimeline();
				this.updateTodayMarker();
			} else this.resetTimeline();
		});
	}
	ngAfterViewInit() {
		this.dayCells.changes.subscribe(() => this.tryScrollTodayIntoView());
		setTimeout(() => this.tryScrollTodayIntoView());
	}

	// --- GANTT BAR DRAG (HORIZONTAL SNAP) ---

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

	dragPointerDown(e: PointerEvent, work: GanttItem) {
		if ((e.target as HTMLElement).closest(".resize-handle")) return;
		if (e.button !== 0) return;
		const container = this.container;
		if (!container) return;
		container.classList.add("bar-drag-active");
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		const bodyEl = container.querySelector(".gantt-body") as HTMLElement | null;
		const totalWidthPx = bodyEl?.clientWidth || container.clientWidth;
		const dayWidthPx = totalWidthPx / this.totalDays();
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

	dragPointerMove(e: PointerEvent, work: GanttItem) {
		if (this.resizeInfo && this.resizeInfo.workId === work.workId) {
			this.handleResizeMove(e, work);
			return;
		}
		if (!this.barDragInfo || this.barDragInfo.workId !== work.workId) return;
		const info = this.barDragInfo;
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

	dragPointerUp(e: PointerEvent, work: GanttItem) {
		if (this.resizeInfo && this.resizeInfo.workId === work.workId) {
			this.handleResizeUp(e, work);
			return;
		}
		if (!this.barDragInfo || this.barDragInfo.workId !== work.workId) return;
		const info = this.barDragInfo;
		const container = this.container;
		const finalBar = (e.target as HTMLElement).closest(
			".gantt-bar",
		) as HTMLElement | null;
		const newLeftPx = info.lastLeftPx;
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

		this.alterDateOnWork(work.workId, movedDays);
		this.barDragInfo = null;
		if (container) container.classList.remove("bar-drag-active");
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	}

	resizePointerDown(e: PointerEvent, work: GanttItem, side: "left" | "right") {
		if (e.button !== 0) return;
		const container = this.container;
		if (!container) return;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		const bodyEl = container.querySelector(".gantt-body") as HTMLElement | null;
		if (!bodyEl) return;
		const totalWidthPx = bodyEl.clientWidth || container.clientWidth;
		const dayWidthPx = totalWidthPx / this.totalDays();
		const barEl = (e.target as HTMLElement).closest(
			".gantt-bar",
		) as HTMLElement | null;
		if (!barEl) return;
		const barRect = barEl.getBoundingClientRect();
		const bodyRect = bodyEl.getBoundingClientRect();
		const origStartPx = barRect.left - bodyRect.left;
		const origWidthPx = barRect.width;
		this.resizeInfo = {
			workId: work.workId,
			side,
			origStartPx,
			origWidthPx,
			dayWidthPx,
			bodyLeft: bodyRect.left,
			pointerStartX: e.clientX,
			minWidthPx: dayWidthPx,
			lastLeftPx: origStartPx,
			lastWidthPx: origWidthPx,
		};
		barEl.classList.add("resizing");
		e.preventDefault();
	}

	// --- TIMELINE & TODAY MARKER ---

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
		// kept for future extension (currently just recomputes todaysIndex in build)
	}

	tryScrollTodayIntoView() {
		if (this.scrolledToToday || !this.container) return;
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
	}

	// --- GANTT BAR RESIZE ---

	handleResizeMove(e: PointerEvent, work: GanttItem) {
		if (!this.resizeInfo || this.resizeInfo.workId !== work.workId) return;
		const info = this.resizeInfo;
		const delta = e.clientX - info.pointerStartX;
		let newLeft = info.origStartPx;
		let newWidth = info.origWidthPx;
		if (info.side === "right") {
			newWidth = this.clamp(
				info.origWidthPx + delta,
				info.minWidthPx,
				this.totalDays() * info.dayWidthPx - info.origStartPx,
			);
		} else {
			newLeft = this.clamp(
				info.origStartPx + delta,
				0,
				info.origStartPx + info.origWidthPx - info.minWidthPx,
			);
			newWidth = info.origWidthPx - (newLeft - info.origStartPx);
		}
		info.lastLeftPx = newLeft;
		info.lastWidthPx = newWidth;
		const barEl = (e.target as HTMLElement).closest(
			".gantt-bar",
		) as HTMLElement | null;
		if (barEl) {
			barEl.style.willChange = "transform,width";
			barEl.style.transform = `translateX(${newLeft - info.origStartPx}px)`;
			barEl.style.width = `${newWidth}px`;
		}
	}

	handleResizeUp(e: PointerEvent, work: GanttItem) {
		if (!this.resizeInfo || this.resizeInfo.workId !== work.workId) return;
		const info = this.resizeInfo;
		const barEl = (e.target as HTMLElement).closest(
			".gantt-bar",
		) as HTMLElement | null;
		if (barEl) {
			const startIndex = Math.round(info.lastLeftPx / info.dayWidthPx);
			const endIndexExclusive = Math.round(
				(info.lastLeftPx + info.lastWidthPx) / info.dayWidthPx,
			);
			const clampedStart = this.clamp(startIndex, 0, this.totalDays() - 1);
			const clampedEndEx = this.clamp(
				endIndexExclusive,
				clampedStart + 1,
				this.totalDays(),
			);
			const snappedLeftPx = clampedStart * info.dayWidthPx;
			const snappedWidthPx = clampedEndEx * info.dayWidthPx - snappedLeftPx;
			barEl.style.transform = "";
			barEl.style.willChange = "";
			const pctLeft = (clampedStart / this.totalDays()) * 100;
			const pctWidth =
				(snappedWidthPx / (this.totalDays() * info.dayWidthPx)) * 100;
			barEl.style.marginLeft = `${pctLeft}%`;
			barEl.style.width = `${pctWidth}%`;
			barEl.classList.remove("resizing");

			this.applyResize(work, clampedStart, clampedEndEx);
		}
		this.resizeInfo = null;
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
	}

	applyResize(work: GanttItem, startIndex: number, endIndexExclusive: number) {
		const newStartDate = this.addDays(this.timelineStartDate(), startIndex);

		const lengthDays = endIndexExclusive - startIndex;
		const currentLength = this.daysBetween(work.startDate, work.targetDate);
		console.log("length", lengthDays, currentLength);
		if (lengthDays === currentLength) return;
		const newTargetDate = this.addDays(newStartDate, lengthDays);
		work.startDate = newStartDate;
		work.targetDate = newTargetDate;
		const alterData: AlterWork = {
			workId: work.workId,
			startDate: newStartDate,
			targetDate: newTargetDate,
		};
		this.ganttPageService.alterDataOnWork(work.workId, alterData);
	}

	alterDateOnWork(workId: number, movedDays: number) {
		if (movedDays === 0) return;
		const ganttItem = this.ganttPageService.getGanttItemById(workId);
		if (!ganttItem) return;

		const day = 24 * 60 * 60 * 1000;
		const startDate = new Date(ganttItem.startDate);
		const targetDate = new Date(ganttItem.targetDate);
		ganttItem.startDate = new Date(startDate.getTime() + movedDays * day);
		ganttItem.targetDate = new Date(targetDate.getTime() + movedDays * day);
		const alterData: AlterWork = {
			workId,
			startDate: ganttItem.startDate,
			targetDate: ganttItem.targetDate,
		};
		console.log("Altering work:", alterData);
		this.ganttPageService.alterDataOnWork(workId, alterData);
	}

	// --- CALCULATION & DISPLAY HELPERS (keep at bottom) ---

	calculateGanttBarStart(startDate: Date): string {
		return `${(this.daysBetween(this.timelineStartDate(), startDate) / this.totalDays()) * 100}%`;
	}

	calculateTodayLineLocation(): string {
		const offset = 8;
		const percent = ((this.todaysIndex() || 0) / this.totalDays()) * 100;
		return `calc(${percent}% + ${offset}px)`;
	}

	getUserListAsString(users: NameListItem[]) {
		return users.map((u) => u.name).join(", ");
	}

	// --- GENERIC HELPERS ---

	get container() {
		return this.ganttScrollRef?.nativeElement || null;
	}
	clamp(v: number, min: number, max: number) {
		return Math.max(min, Math.min(max, v));
	}
	daysBetween(date1: Date, date2: Date): number {
		const oneDay = 24 * 60 * 60 * 1000;
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		d1.setHours(0, 0, 0, 0);
		d2.setHours(0, 0, 0, 0);
		const diffTime = d2.getTime() - d1.getTime();
		return Math.round(diffTime / oneDay);
	}
	addDays(base: Date, days: number) {
		return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
	}

	isWorkOverdue(w: GanttItem): boolean {
		console.log("Checking if work is overdue:", w.stateName);
		return w.stateName !== 'DONE' &&
			(new Date(w.targetDate)).setHours(0,0,0,0) < this.today().setHours(0,0,0,0);
	}
}
