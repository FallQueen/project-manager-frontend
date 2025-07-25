import { Component, inject, type Signal } from "@angular/core";
import { StateBatteryComponent } from "../../component/state-battery/state-battery.component";
import { CardBacklogComponent } from "../../component/card-backlog/card-backlog.component";
import { ProjectPageService } from "../../service/project-page.service";
import { BacklogPageService } from "../../service/backlog-page.service";
import type { BacklogData } from "../../model/format.type";

@Component({
	selector: "app-backlog-page",
	imports: [CardBacklogComponent],
	templateUrl: "./backlog-page.component.html",
	styleUrl: "./backlog-page.component.css",
})
export class BacklogPageComponent {
	backlogPageService = inject(BacklogPageService);
	backlogList: Signal<BacklogData[]> = this.backlogPageService.backlogList;
}
