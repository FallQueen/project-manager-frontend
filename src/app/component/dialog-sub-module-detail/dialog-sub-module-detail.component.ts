import { Component, Input } from "@angular/core";
import type { SubModuleData } from "../../model/format.type";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-dialog-sub-module-detail",
	imports: [CommonModule],
	templateUrl: "./dialog-sub-module-detail.component.html",
	styleUrl: "./dialog-sub-module-detail.component.css",
})
export class DialogSubModuleDetailComponent {
	@Input() subModuleData!: SubModuleData;
}
