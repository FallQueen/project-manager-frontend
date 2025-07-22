import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { UserSearchBaseComponent } from "./user-search-base.component";

describe("UserSearchBaseComponent", () => {
	let component: UserSearchBaseComponent;
	let fixture: ComponentFixture<UserSearchBaseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UserSearchBaseComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UserSearchBaseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
