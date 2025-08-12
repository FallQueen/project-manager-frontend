import { Component, inject, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatIconModule } from "@angular/material/icon"; // <-- Import the module
import { DataProcessingService } from "../../service/data-processing.service";
import { LoginService } from "../../service/login.service";
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { FormsModule } from "@angular/forms";
import type { NameListItem, workNameListItem } from "../../model/format.type";
import { SearchBarProjAndWorkComponent } from "../search-bar-proj-and-work/search-bar-proj-and-work.component";

@Component({
	selector: "app-side-bar",
	imports: [
		RouterLink,
		MatIconModule,
		RouterLinkActive,
		SearchBarProjAndWorkComponent,
		FormsModule,
	],
	templateUrl: "./side-bar.component.html",
	styleUrl: "./side-bar.component.css",
})
export class SideBarComponent {
	dataService = inject(DataProcessingService);
	loginService = inject(LoginService);
	username = signal<string>(this.dataService.usernameSignal());
	searchInput = signal<string>("");
	projectList = signal<NameListItem[]>([]);
	workList = signal<workNameListItem[]>([]);
	isExpanded = signal<boolean>(true);

	ngOnInit() {
		this.dataService.getProjectAndWorkNames().subscribe((data) => {
			this.projectList.set(data.projectList);
			this.workList.set(data.workList);
		});
	}

	toggleSidebar() {
		this.isExpanded.set(!this.isExpanded());
	}
}
