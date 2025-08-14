import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogWorkBugInputComponent } from "./dialog-work-bug-input.component";

describe("DialogWorkBugInputComponent", () => {
	let component: DialogWorkBugInputComponent;
	let fixture: ComponentFixture<DialogWorkBugInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogWorkBugInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogWorkBugInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
