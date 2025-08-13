import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogSubModuleDetailComponent } from "./dialog-sub-module-detail.component";

describe("DialogSubModuleDetailComponent", () => {
	let component: DialogSubModuleDetailComponent;
	let fixture: ComponentFixture<DialogSubModuleDetailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogSubModuleDetailComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogSubModuleDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
