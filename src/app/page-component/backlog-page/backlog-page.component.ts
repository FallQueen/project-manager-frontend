import { Component, inject, type Signal } from "@angular/core";
import { BacklogPageService } from "../../service/backlog-page.service";
import type { SubModuleData } from "../../model/format.type";

import { CardSubModuleComponent } from "../../component/card-sub-module/card-sub-module.component";
import { CardSubModuleNewComponent } from "../../component/card-sub-module-new/card-sub-module-new.component";

@Component({
	selector: "app-backlog-page",
	imports: [CardSubModuleComponent, CardSubModuleNewComponent],
	templateUrl: "./backlog-page.component.html",
	styleUrl: "./backlog-page.component.css",
})
export class BacklogPageComponent {
	backlogPageService = inject(BacklogPageService);
	// Signal holding the list of sub-modules for the backlog
	backlogList: Signal<SubModuleData[]> = this.backlogPageService.subModuleList;

	ngOnInit() {}
}
