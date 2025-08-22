import {
	Component,
	EventEmitter,
	inject,
	Input,
	output,
	Output,
} from "@angular/core";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatIconModule } from "@angular/material/icon";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-dialog-util-title",
	imports: [MatIconModule],
	templateUrl: "./dialog-util-title.component.html",
	styleUrl: "./dialog-util-title.component.css",
})
export class DialogUtilTitleComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	@Input() new = false;
	@Input() editable = false;
	@Input() title = "";
	@Input() titleNew:
		| "NEW PROJECT"
		| "NEW MODULE"
		| "NEW SUB-MODULE"
		| "NEW WORK"
		| "NEW BUG REPORT" = "NEW PROJECT";
	@Output() edit = new EventEmitter<void>();
	@Output() delete = new EventEmitter<void>();

	openDeleteConfirmation() {
		let message = "";
		if (this.title.toLowerCase().includes("project")) {
			message = "Are you sure you want to delete this project?";
		} else if (this.title.toLowerCase().includes("module")) {
			message = "Are you sure you want to delete this module?";
		} else if (this.title.toLowerCase().includes("sub-module")) {
			message = "Are you sure you want to delete this sub-module?";
		} else if (this.title.toLowerCase().includes("work")) {
			message = "Are you sure you want to delete this work item?";
		} else if (this.title.toLowerCase().includes("bug")) {
			message = "Are you sure you want to delete this bug?";
		}
		const dialogRef = this.dialogService.openUtilityDialog(
			message,
			"confirmation",
		);

		dialogRef.afterClosed().subscribe((result) => {
			if (result === true) {
				this.delete.emit();
			}
		});
	}
}
