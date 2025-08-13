import { type ComponentFixture, TestBed } from "@angular/core/testing";

// Update the import path to the correct location of the component
import { DialogSubModuleContainerComponent } from "./dialog-sub-module-container.component";

describe("DialogSubModuleContainerComponent", () => {
	let component: DialogSubModuleContainerComponent;
	let fixture: ComponentFixture<DialogSubModuleContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogSubModuleContainerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogSubModuleContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
