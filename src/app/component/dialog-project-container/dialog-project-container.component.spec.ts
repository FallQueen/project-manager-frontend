import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogProjectContainerComponent } from "./dialog-project-container.component";

describe("DialogProjectContainerComponent", () => {
	let component: DialogProjectContainerComponent;
	let fixture: ComponentFixture<DialogProjectContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogProjectContainerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogProjectContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
