import { Component, inject, signal } from "@angular/core";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatIconModule } from "@angular/material/icon";
import { SearchBarProjAndWorkComponent } from "../search-bar-proj-and-work/search-bar-proj-and-work.component";
import type { NameListItem, workNameListItem } from "../../model/format.type";
// import { f } from "../../../../node_modules/@angular/material/icon-module.d-COXCrhrh";

@Component({
	selector: "app-header",
	imports: [MatIconModule, SearchBarProjAndWorkComponent],
	templateUrl: "./header.component.html",
	styleUrl: "./header.component.css",
})
export class HeaderComponent {
	dataService = inject(DataProcessingService);
	projectList = signal<NameListItem[]>([]);
	workList = signal<workNameListItem[]>([]);
	ngOnInit() {
		this.dataService.getProjectAndWorkNames().subscribe((data) => {
			this.projectList.set(data.projectList);
			this.workList.set(data.workList);
		});
	}
}
