import { Component, inject } from "@angular/core";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatIconModule } from "@angular/material/icon";
// import { f } from "../../../../node_modules/@angular/material/icon-module.d-COXCrhrh";

@Component({
	selector: "app-header",
	imports: [MatIconModule],
	templateUrl: "./header.component.html",
	styleUrl: "./header.component.css",
})
export class HeaderComponent {
	dataService = inject(DataProcessingService);
}
