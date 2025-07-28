import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { CardProjectNewComponent } from "./card-project-new.component";

describe("CardProjectNewComponent", () => {
	let component: CardProjectNewComponent;
	let fixture: ComponentFixture<CardProjectNewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardProjectNewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardProjectNewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
