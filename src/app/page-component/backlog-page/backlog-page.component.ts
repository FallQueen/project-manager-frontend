import { Component, inject, type Signal } from "@angular/core";
import { BacklogPageService } from "../../service/backlog-page.service";
import type { SubModuleData } from "../../model/format.type";

import { CardSubModuleComponent } from "../../component/card-sub-module/card-sub-module.component";
import { CardSubModuleNewComponent } from "../../component/card-sub-module-new/card-sub-module-new.component";
import { CardModuleComponent } from "../../component/card-module/card-module.component";

@Component({
	selector: "app-backlog-page",
	imports: [
		CardSubModuleComponent,
		CardSubModuleNewComponent,
		CardModuleComponent,
	],
	templateUrl: "./backlog-page.component.html",
	styleUrl: "./backlog-page.component.css",
})
export class BacklogPageComponent {
	// Injects the BacklogPageService, which provides business/data logic for the backlog page
	backlogPageService = inject(BacklogPageService);

	// Signal holding the list of sub-modules for the backlog; updates reactively when the service changes
	backlogList: Signal<SubModuleData[]> = this.backlogPageService.subModuleList;

	// Angular lifecycle hook: called once after component is initialized
	// (Currently unused, but can be used for setup logic if needed)
	ngOnInit() {}
}
