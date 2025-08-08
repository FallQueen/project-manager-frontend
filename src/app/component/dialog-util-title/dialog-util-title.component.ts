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
	@Input() new = true;
	@Input() editable = false;
	@Input() title = "";
	@Input() titleNew: "NEW PROJECT" | "NEW BACKLOG" | "NEW WORK" = "NEW PROJECT";
	@Output() edit = new EventEmitter<void>();
	@Output() delete = new EventEmitter<void>();

	openDeleteConfirmation() {
		let message = "";
		if (this.title.toLowerCase().includes("project")) {
			message = "Are you sure you want to delete this project?";
		} else if (this.title.toLowerCase().includes("backlog")) {
			message = "Are you sure you want to delete this backlog?";
		} else if (this.title.toLowerCase().includes("work")) {
			message = "Are you sure you want to delete this work item?";
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
