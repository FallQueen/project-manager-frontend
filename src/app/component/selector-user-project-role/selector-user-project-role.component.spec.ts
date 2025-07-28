import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectorUserProjectRoleComponent } from "./selector-user-project-role.component";

describe("SelectorUserProjectRoleComponent", () => {
	let component: SelectorUserProjectRoleComponent;
	let fixture: ComponentFixture<SelectorUserProjectRoleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SelectorUserProjectRoleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SelectorUserProjectRoleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
