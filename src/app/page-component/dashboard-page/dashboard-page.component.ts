import { Component, inject } from "@angular/core";
import { CardTodoComponent } from "../../component/card-todo/card-todo.component";
import { DashboardService } from "../../service/dashboard.service";
import { signal } from "@angular/core";

@Component({
	selector: "app-dashboard-page",
	imports: [CardTodoComponent],
	templateUrl: "./dashboard-page.component.html",
	styleUrl: "./dashboard-page.component.css",
})
export class DashboardPageComponent {
	dashboardService = inject(DashboardService);
	todoList = this.dashboardService.userTodoList;

	getIndexOfWorkType(type: string): number {
		return this.todoList().findIndex((item) => item.stateName === type);
	}
}
