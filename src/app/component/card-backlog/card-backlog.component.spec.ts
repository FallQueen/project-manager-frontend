import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { CardBacklogComponent } from "./card-backlog.component";

describe("CardBacklogComponent", () => {
	let component: CardBacklogComponent;
	let fixture: ComponentFixture<CardBacklogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardBacklogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardBacklogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
