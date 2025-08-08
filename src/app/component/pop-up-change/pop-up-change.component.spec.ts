import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { PopUpChangeComponent } from "./pop-up-change.component";

describe("PopUpChangeComponent", () => {
	let component: PopUpChangeComponent;
	let fixture: ComponentFixture<PopUpChangeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PopUpChangeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PopUpChangeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
