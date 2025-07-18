import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogNewProjectComponent } from "./dialog-new-project.component";

describe("DialogNewProjectComponent", () => {
	let component: DialogNewProjectComponent;
	let fixture: ComponentFixture<DialogNewProjectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogNewProjectComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogNewProjectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
