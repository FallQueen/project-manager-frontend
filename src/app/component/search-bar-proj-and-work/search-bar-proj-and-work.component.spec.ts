import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchBarProjAndWorkComponent } from "./search-bar-proj-and-work.component";

describe("SearchBarProjAndWorkComponent", () => {
	let component: SearchBarProjAndWorkComponent;
	let fixture: ComponentFixture<SearchBarProjAndWorkComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchBarProjAndWorkComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SearchBarProjAndWorkComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
