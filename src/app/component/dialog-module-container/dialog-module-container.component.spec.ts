import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { DialogModuleContainerComponent } from "./dialog-module-container.component";

describe("DialogModuleContainerComponent", () => {
	let component: DialogModuleContainerComponent;
	let fixture: ComponentFixture<DialogModuleContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DialogModuleContainerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(DialogModuleContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
