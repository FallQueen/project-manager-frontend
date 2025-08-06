import { Component, inject } from "@angular/core";
import { BugPageService } from "../../service/bug-page.service";
import { CardTodoComponent } from "../../component/card-todo/card-todo.component";

@Component({
	selector: "app-bug-page",
	imports: [CardTodoComponent],
	templateUrl: "./bug-page.component.html",
	styleUrl: "./bug-page.component.css",
})
export class BugPageComponent {
	bugPageService = inject(BugPageService);
	bugList = this.bugPageService.bugList;
}
