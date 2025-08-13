import { Component, inject } from "@angular/core";
import { CardTodoComponent } from "../../component/card-todo/card-todo.component";
import { DashboardPageService } from "../../service/dashboard-page.service";
import { signal } from "@angular/core";

@Component({
	selector: "app-dashboard-page",
	imports: [CardTodoComponent],
	templateUrl: "./dashboard-page.component.html",
	styleUrl: "./dashboard-page.component.css",
})
export class DashboardPageComponent {
	dashboardService = inject(DashboardPageService);
	todoList = this.dashboardService.userTodoList;
}
