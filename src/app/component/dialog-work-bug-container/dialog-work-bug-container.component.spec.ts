import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogWorkBugContainerComponent } from "./dialog-work-bug-container.component";

describe("DialogWorkBugContainerComponent", () => {
	let component: DialogWorkBugContainerComponent;
	let fixture: ComponentFixture<DialogWorkBugContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogWorkBugContainerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogWorkBugContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
