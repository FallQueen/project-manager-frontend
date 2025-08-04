import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { CardTodoComponent } from "./card-todo.component";

describe("CardTodoComponent", () => {
	let component: CardTodoComponent;
	let fixture: ComponentFixture<CardTodoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardTodoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardTodoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
