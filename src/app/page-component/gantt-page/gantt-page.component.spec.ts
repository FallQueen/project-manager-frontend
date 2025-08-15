import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { GanttPageComponent } from "./gantt-page.component";

describe("GanttPageComponent", () => {
	let component: GanttPageComponent;
	let fixture: ComponentFixture<GanttPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GanttPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GanttPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
