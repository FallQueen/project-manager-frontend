import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogProjectDetailComponent } from "./dialog-project-detail.component";

describe("DialogProjectDetailComponent", () => {
	let component: DialogProjectDetailComponent;
	let fixture: ComponentFixture<DialogProjectDetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogProjectDetailComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogProjectDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
