import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogProjectEditComponent } from "./dialog-project-edit.component";

describe("DialogProjectEditComponent", () => {
	let component: DialogProjectEditComponent;
	let fixture: ComponentFixture<DialogProjectEditComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogProjectEditComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogProjectEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
