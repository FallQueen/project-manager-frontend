import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../component/header/header.component";
import { SideBarComponent } from "../../component/side-bar/side-bar.component";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-home-page",
	imports: [RouterOutlet, HeaderComponent, SideBarComponent],
	templateUrl: "./home-page.component.html",
	styleUrl: "./home-page.component.css",
})
export class HomePageComponent {
	dataService = inject(DataProcessingService);
	ngOnInit() {
		this.dataService.getandSetStartBundle();
	}
}
