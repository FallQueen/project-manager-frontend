import { Component, inject, signal } from "@angular/core";
import { CardProjectComponent } from "../../component/card-project/card-project.component";
import type { Project } from "../../model/format.type";
import { ProjectPageService } from "../../service/project-page.service";
import { CardProjectNewComponent } from "../../component/card-project-new/card-project-new.component";

@Component({
	selector: "app-project-page",
	imports: [CardProjectComponent, CardProjectNewComponent],
	templateUrl: "./project-page.component.html",
	styleUrl: "./project-page.component.css",
})
export class ProjectPageComponent {
	projectPageService = inject(ProjectPageService);
	pageTitle = signal("My Projects");
	isWebMaster = this.projectPageService.dataService.isWebMaster();
	ngOnInit() {
		if (this.isWebMaster) {
			this.pageTitle.set("All Projects");
		}
	}
}
