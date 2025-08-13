import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogSubModuleInputComponent } from "./dialog-sub-module-input.component";

describe("DialogSubModuleInputComponent", () => {
	let component: DialogSubModuleInputComponent;
	let fixture: ComponentFixture<DialogSubModuleInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogSubModuleInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogSubModuleInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
