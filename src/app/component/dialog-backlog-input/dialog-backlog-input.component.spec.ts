import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogBacklogInputComponent } from "./dialog-backlog-input.component";

describe("DialogBacklogInputComponent", () => {
	let component: DialogBacklogInputComponent;
	let fixture: ComponentFixture<DialogBacklogInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogBacklogInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogBacklogInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
