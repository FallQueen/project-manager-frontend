import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { GanttFilterComponent } from "./gantt-filter.component";

describe("GanttFilterComponent", () => {
	let component: GanttFilterComponent;
	let fixture: ComponentFixture<GanttFilterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GanttFilterComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GanttFilterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
