import { Component, inject, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatIconModule } from "@angular/material/icon"; // <-- Import the module
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-side-bar",
	imports: [RouterLink, MatIconModule, RouterLinkActive],
	templateUrl: "./side-bar.component.html",
	styleUrl: "./side-bar.component.css",
})
export class SideBarComponent {
	dataService = inject(DataProcessingService);
	username = signal<string>(this.dataService.getUserName());
}
