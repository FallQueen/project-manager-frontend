import { Component, Input } from "@angular/core";
import type { ModuleData } from "../../model/format.type";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-dialog-module-detail",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./dialog-module-detail.component.html",
	styleUrls: ["./dialog-module-detail.component.css"],
})
export class DialogModuleDetailComponent {
	@Input() moduleData!: ModuleData;
}
