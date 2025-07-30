import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogWorkInputComponent } from "./dialog-work-input.component";

describe("DialogWorkInputComponent", () => {
	let component: DialogWorkInputComponent;
	let fixture: ComponentFixture<DialogWorkInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogWorkInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogWorkInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
