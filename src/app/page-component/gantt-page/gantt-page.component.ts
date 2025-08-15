import { CommonModule, NgStyle } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import type {
	GanttChartData,
	GanttItem,
	NameListItem,
} from "../../model/format.type";
import { GanttPageService } from "../../service/gantt-page.service";
import { MatGridListModule } from "@angular/material/grid-list";

@Component({
	selector: "app-gantt-page",
	imports: [CommonModule, MatGridListModule],
	templateUrl: "./gantt-page.component.html",
	styleUrl: "./gantt-page.component.css",
})
export class GanttPageComponent {
	ganttPageService = inject(GanttPageService);
	// Input property to receive project data from a parent component, now using the new types
	projectData = this.ganttPageService.ganttData;

	tiles = [
		{ text: "One", cols: 3, rows: 1, color: "lightblue" },
		{ text: "Two", cols: 1, rows: 2, color: "lightgreen" },
		{ text: "Three", cols: 1, rows: 1, color: "lightpink" },
		{ text: "Four", cols: 2, rows: 1, color: "#DDBDF1" },
	];

	// --- TIMELINE PROPERTIES ---
	// These properties will be calculated to build the chart's timeline
	public timelineStartDate!: Date;
	public timelineEndDate!: Date;
	public totalDays = 0;
	public months: { name: string; days: number; year: number }[] = [];
	public days: number[] = [];
	public todayPosition: number | null = null;

	// react to data changes
	constructor() {
		effect(() => {
			const data = this.projectData();
			if (data && data.length > 0) {
				this.createTimeline();
				this.calculateTodayMarker();
			} else {
				this.totalDays = 0;
				this.months = [];
				this.days = [];
				this.todayPosition = null;
			}
		});
	}

	/**
	 * Calculates the overall project start and end dates to establish the timeline range.
	 */
	createTimeline(): void {
		// Flatten all work items from all modules into a single array
		const modules = this.projectData();
		if (!modules || modules.length === 0) return;
		const allWorks = modules
			.flatMap((m) => (m?.works ? m.works : []))
			.filter((w) => w?.startDate && w?.targetDate);
		if (allWorks.length === 0) return;

		// Get all start and end dates, filtering out any invalid ones
		const startDates = allWorks
			.map((w) => new Date(w.startDate).getTime())
			.filter((t) => !Number.isNaN(t));
		const endDates = allWorks
			.map((w) => new Date(w.targetDate).getTime())
			.filter((t) => !Number.isNaN(t));
		if (startDates.length === 0 || endDates.length === 0) return;

		// Find the earliest start date and latest end date
		this.timelineStartDate = new Date(Math.min(...startDates));
		this.timelineEndDate = new Date(Math.max(...endDates));

		// Set start date to the beginning of its month for a cleaner timeline view
		// NOTE: Removed forcing start date to first of month to avoid leading empty space

		// Calculate the total number of days in the timeline
		this.totalDays =
			this.daysBetween(this.timelineStartDate, this.timelineEndDate) + 1;
		this.generateTimelineHeaders();
		console.log(this.timelineStartDate, this.timelineEndDate, this.totalDays);
	}

	/**
	 * Generates the month and day headers for the chart's timeline view.
	 */
	private generateTimelineHeaders(): void {
		this.months = [];
		this.days = [];
		const currentDate = new Date(this.timelineStartDate);

		while (currentDate <= this.timelineEndDate) {
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth();
			const monthName = currentDate.toLocaleString("default", {
				month: "long",
			});

			let monthObj = this.months.find(
				(m) => m.name === monthName && m.year === year,
			);
			if (!monthObj) {
				monthObj = { name: monthName, year: year, days: 0 };
				this.months.push(monthObj);
			}

			monthObj.days++;
			this.days.push(currentDate.getDate());

			currentDate.setDate(currentDate.getDate() + 1);
		}
	}

	/**
	 * Calculates the grid column for the 'today' marker.
	 */
	private calculateTodayMarker(): void {
		const today = new Date();
		if (today >= this.timelineStartDate && today <= this.timelineEndDate) {
			this.todayPosition = this.daysBetween(this.timelineStartDate, today) + 1;
		}
	}

	/**
	 * Calculates the grid column positions for a task bar based on its dates.
	 * @param work The GanttItem to calculate the position for.
	 * @returns An object with grid-column-start and grid-column-end properties.
	 */

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	getBarPosition(work: GanttItem): { [key: string]: any } {
		const startDate = new Date(work.startDate);
		const targetDate = new Date(work.targetDate);

		const startDay = this.daysBetween(this.timelineStartDate, startDate) + 1; // +1 for inclusive range
		const endDay = this.daysBetween(this.timelineStartDate, targetDate) + 1; // +1 for inclusive range (grid-column-end is exclusive in CSS grid)

		return {
			"grid-column-start": startDay,
			"grid-column-end": endDay,
			"background-color": "red",
		};
	}

	/**
	 * Helper function to calculate the number of days between two dates.
	 * @param date1 The first date.
	 * @param date2 The second date.
	 * @returns The total number of full days between the two dates.
	 */
	private daysBetween(date1: Date, date2: Date): number {
		const oneDay = 24 * 60 * 60 * 1000;
		const d1 = new Date(date1);
		const d2 = new Date(date2);
		d1.setHours(0, 0, 0, 0);
		d2.setHours(0, 0, 0, 0);
		const diffTime = d2.getTime() - d1.getTime();
		return Math.round(diffTime / oneDay);
	}

	/**
	 * Formats a date string into a more readable format (e.g., "Jul 3, 2025").
	 * @param dateInput The date string or object to format.
	 * @returns A formatted, readable date string.
	 */
	formatDate(dateInput: string | Date): string {
		const date = new Date(dateInput);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	getUserListAsString(users: NameListItem[]) {
		return users.map((user) => user.name).join(", ");
	}
}
