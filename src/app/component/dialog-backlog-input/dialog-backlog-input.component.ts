import { Component, inject, Input, Output, signal } from "@angular/core";
import { DataProcessingService } from "../../service/data-processing.service";
import type { BacklogData, NameListItem } from "../../model/format.type";
import { MatDialogRef } from "@angular/material/dialog";
import type { DialogBacklogContainerComponent } from "../dialog-backlog-container/dialog-backlog-container.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: "app-dialog-backlog-input",
	imports: [],
	templateUrl: "./dialog-backlog-input.component.html",
	styleUrl: "./dialog-backlog-input.component.css",
})
export class DialogBacklogInputComponent {
	dataService = inject(DataProcessingService);
	@Input() projectId!: number;
	@Input() backlog!: BacklogData;
	containerDialogRef = inject(MatDialogRef<DialogBacklogContainerComponent>);

	backlogForm = new FormGroup({
		backlogName: new FormControl("", [Validators.required]),
		description: new FormControl("", [Validators.required]),
		// A nested group for the date range
		dateRange: new FormGroup({
			start: new FormControl<Date | null>(null, [Validators.required]),
			end: new FormControl<Date | null>(null, [Validators.required]),
		}),
		// A control to hold the ID from the search bar
		state: new FormControl<NameListItem | null>(null, [Validators.required]),
		pic: new FormControl<string | null>(null),
		priority: new FormControl<NameListItem | null>(null, [Validators.required]),
		estimatedHours: new FormControl<number | null>(null, [Validators.required]),
		tracker: new FormControl<NameListItem | null>(null, [Validators.required]),
		activity: new FormControl<NameListItem | null>(null, [Validators.required]),
	});

	get f() {
		return this.backlogForm.controls;
	}

	ngOnInit() {
		if (this.backlog) {
			this.backlogForm.patchValue({
				backlogName: this.backlog.backlogName,
				description: this.backlog.description,
				dateRange: {
					start: this.backlog.startDate
						? new Date(this.backlog.startDate)
						: null,
					end: this.backlog.targetDate
						? new Date(this.backlog.targetDate)
						: null,
				},
				pic: this.backlog.picName || "",
				priority: {
					id: this.backlog.priorityId,
					name: this.backlog.priorityName,
				},
			});
			this.currentPic().name = this.backlog.picName;
		}
	}
}
