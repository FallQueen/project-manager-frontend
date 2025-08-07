import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogUtilTitleComponent } from "./dialog-util-title.component";

describe("DialogUtilTitleComponent", () => {
	let component: DialogUtilTitleComponent;
	let fixture: ComponentFixture<DialogUtilTitleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogUtilTitleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogUtilTitleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
