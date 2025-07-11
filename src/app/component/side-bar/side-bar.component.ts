import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon"; // <-- Import the module

@Component({
	selector: "app-side-bar",
	imports: [RouterLink, MatIconModule],
	templateUrl: "./side-bar.component.html",
	styleUrl: "./side-bar.component.css",
})
export class SideBarComponent {}
