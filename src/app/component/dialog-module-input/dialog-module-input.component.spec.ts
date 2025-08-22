import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogModuleInputComponent } from "./dialog-module-input.component";

describe("DialogModuleInputComponent", () => {
	let component: DialogModuleInputComponent;
	let fixture: ComponentFixture<DialogModuleInputComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogModuleInputComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogModuleInputComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
