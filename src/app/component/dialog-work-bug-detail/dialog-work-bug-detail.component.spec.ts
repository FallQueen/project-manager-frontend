import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogWorkBugDetailComponent } from "./dialog-work-bug-detail.component";

describe("DialogWorkBugDetailComponent", () => {
	let component: DialogWorkBugDetailComponent;
	let fixture: ComponentFixture<DialogWorkBugDetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogWorkBugDetailComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogWorkBugDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
