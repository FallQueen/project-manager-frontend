import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { CardSubModuleNewComponent } from "./card-sub-module-new.component";

describe("CardSubModuleNewComponent", () => {
	let component: CardSubModuleNewComponent;
	let fixture: ComponentFixture<CardSubModuleNewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardSubModuleNewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardSubModuleNewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
