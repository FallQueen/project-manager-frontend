import { ComponentFixture, TestBed } from "@angular/core/testing";

import { subModulePageComponent } from "./subModule-page.component";

describe("subModulePageComponent", () => {
	let component: subModulePageComponent;
	let fixture: ComponentFixture<subModulePageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [subModulePageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(subModulePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
