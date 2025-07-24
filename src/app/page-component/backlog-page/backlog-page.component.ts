import { Component } from "@angular/core";
import { StateBatteryComponent } from "../../component/state-battery/state-battery.component";
import { CardBacklogComponent } from "../../component/card-backlog/card-backlog.component";

@Component({
	selector: "app-backlog-page",
	imports: [CardBacklogComponent],
	templateUrl: "./backlog-page.component.html",
	styleUrl: "./backlog-page.component.css",
})
export class BacklogPageComponent {}
