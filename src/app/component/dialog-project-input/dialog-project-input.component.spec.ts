import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogProjectInputComponent } from "./dialog-project-input.component";

describe("DialogProjectInputComponent", () => {
	let component: DialogProjectInputComponent;
	let fixture: ComponentFixture<DialogProjectInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogProjectInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogProjectInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
