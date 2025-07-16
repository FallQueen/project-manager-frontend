import { Component, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-card-new-project",
	imports: [MatIconModule],
	templateUrl: "./card-new-project.component.html",
	styleUrl: "./card-new-project.component.css",
})
export class CardNewProjectComponent {
	empty = signal(true);

	changeForm() {
		this.empty.set(!this.empty());
	}
}
