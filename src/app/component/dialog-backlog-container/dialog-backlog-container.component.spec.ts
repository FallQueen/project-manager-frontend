import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogBacklogContainerComponent } from "./dialog-backlog-container.component";

describe("DialogBacklogContainerComponent", () => {
	let component: DialogBacklogContainerComponent;
	let fixture: ComponentFixture<DialogBacklogContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogBacklogContainerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogBacklogContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
