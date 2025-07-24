import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { StateBatteryComponent } from "./state-battery.component";

describe("StateBatteryComponent", () => {
	let component: StateBatteryComponent;
	let fixture: ComponentFixture<StateBatteryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [StateBatteryComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(StateBatteryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
