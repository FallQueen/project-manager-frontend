import { Component, inject } from "@angular/core";
import { CardTodoComponent } from "../../component/card-todo/card-todo.component";
import { DashboardService } from "../../service/dashboard.service";
import { PopUpChangeComponent } from "../../component/pop-up-change/pop-up-change.component";

@Component({
	selector: "app-dashboard-page",
	imports: [CardTodoComponent, PopUpChangeComponent],
	templateUrl: "./dashboard-page.component.html",
	styleUrl: "./dashboard-page.component.css",
})
export class DashboardPageComponent {
	dashboardService = inject(DashboardService);
	todoList = this.dashboardService.userTodoList;

	ngOnInit() {}
	getIndexOfWorkType(type: string): number {
		return this.todoList().findIndex((item) => item.stateName === type);
	}
}
