import {
	Component,
	computed,
	inject,
	type Signal,
	signal,
} from "@angular/core";
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
	// Inject the service to manage project data
	projectPageService = inject(ProjectPageService);

	// Signal holding the current page title, initialized to "My Projects"
	pageTitle = signal("My Projects");

	// Computed signal to determine if the current user is a webmaster
	isWebMaster: Signal<boolean> = computed(() => {
		// Get the user's web role (not used directly here, but used to trigger when changed)
		const webRole = this.projectPageService.dataService.webRoleSignal();
		// Check if the user has webmaster privileges
		return this.projectPageService.dataService.isWebMaster();
	});

	ngOnInit() {
		// If the user is a webmaster, update the page title to "All Projects"
		if (this.isWebMaster()) {
			this.pageTitle.set("All Projects");
		}
	}
}
