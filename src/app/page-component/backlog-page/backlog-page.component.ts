import { Component, inject, type Signal } from "@angular/core";
import { ProjectPageService } from "../../service/project-page.service";
import { BacklogPageService } from "../../service/backlog-page.service";
import type { BacklogData } from "../../model/format.type";
import { CardBacklogNewComponent } from "../../component/card-backlog-new/card-backlog-new.component";
import { CardBacklogComponent } from "../../component/card-backlog/card-backlog.component";

@Component({
	selector: "app-backlog-page",
	imports: [CardBacklogComponent, CardBacklogNewComponent],
	templateUrl: "./backlog-page.component.html",
	styleUrl: "./backlog-page.component.css",
})
export class BacklogPageComponent {
	backlogPageService = inject(BacklogPageService);
	backlogList: Signal<BacklogData[]> = this.backlogPageService.backlogList;
}
