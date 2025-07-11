import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../component/header/header.component";
import { SideBarComponent } from "../../component/side-bar/side-bar.component";

@Component({
	selector: "app-home-page",
	imports: [RouterOutlet, HeaderComponent, SideBarComponent],
	templateUrl: "./home-page.component.html",
	styleUrl: "./home-page.component.css",
})
export class HomePageComponent {}
