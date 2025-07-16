import { Component, inject, signal } from "@angular/core";
import { CardProjectComponent } from "../../component/card-project/card-project.component";
import type { Project } from "../../model/format.type";
import { ProjectPageService } from "../../service/project-page.service";
import { CardNewProjectComponent } from "../../component/card-new-project/card-new-project.component";

@Component({
	selector: "app-project-page",
	imports: [CardProjectComponent, CardNewProjectComponent],
	templateUrl: "./project-page.component.html",
	styleUrl: "./project-page.component.css",
})
export class ProjectPageComponent {
	projectPageService = inject(ProjectPageService);

	ngOnInit() {}
}
