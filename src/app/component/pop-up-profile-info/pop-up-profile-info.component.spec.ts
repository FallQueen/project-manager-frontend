import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PopUpProfileInfoComponent } from "./pop-up-profile-info.component";

describe("PopUpProfileInfoComponent", () => {
	let component: PopUpProfileInfoComponent;
	let fixture: ComponentFixture<PopUpProfileInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PopUpProfileInfoComponent],
			providers: [
				{ provide: MatDialogRef, useValue: {} },
				{
					provide: MAT_DIALOG_DATA,
					useValue: { name: "Test User", email: "test@example.com" },
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(PopUpProfileInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
