import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectorUserWorkComponent } from "./selector-user-work.component";

describe("SelectorUserWorkComponent", () => {
	let component: SelectorUserWorkComponent;
	let fixture: ComponentFixture<SelectorUserWorkComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SelectorUserWorkComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SelectorUserWorkComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
