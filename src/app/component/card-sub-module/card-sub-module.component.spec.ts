import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { CardSubModuleComponent } from "./card-sub-module.component";

describe("CardSubModuleComponent", () => {
	let component: CardSubModuleComponent;
	let fixture: ComponentFixture<CardSubModuleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardSubModuleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardSubModuleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
