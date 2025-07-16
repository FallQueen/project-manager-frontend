import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { CardNewProjectComponent } from "./card-new-project.component";

describe("CardNewProjectComponent", () => {
	let component: CardNewProjectComponent;
	let fixture: ComponentFixture<CardNewProjectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardNewProjectComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardNewProjectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
