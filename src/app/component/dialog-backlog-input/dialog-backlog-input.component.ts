import { Component, inject, signal, Input } from "@angular/core";
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_NATIVE_DATE_FORMATS,
	MatNativeDateModule,
	MatOptionModule,
	NativeDateAdapter,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatError, MatInputModule } from "@angular/material/input";
import type {
	AlterBacklog,
	BacklogData,
	NameListItem,
	NewBacklog,
} from "../../model/format.type";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { CommonModule, NgIf } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DataProcessingService } from "../../service/data-processing.service";
import { TextFieldModule } from "@angular/cdk/text-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-dialog-backlog-input",
	imports: [
		CommonModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatError,
		FormsModule,
		NgIf,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatButtonModule,
		TextFieldModule,
		MatOptionModule,
		MatAutocompleteModule,
		SearchBarComponent,
	],
	templateUrl: "./dialog-backlog-input.component.html",
	styleUrl: "./dialog-backlog-input.component.css",
	providers: [
		{ provide: DateAdapter, useClass: NativeDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
	],
})
export class DialogBacklogInputComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	projectId = this.dataService.projectIdSignal();
	@Input() backlogData!: BacklogData;

	backlogForm = new FormGroup({
		backlogName: new FormControl("", [Validators.required]),
		description: new FormControl("", [Validators.required]),
		// A nested group for the date range
		dateRange: new FormGroup({
			start: new FormControl<Date | null>(null, [Validators.required]),
			end: new FormControl<Date | null>(null, [Validators.required]),
		}),
		pic: new FormControl<NameListItem | null>(null, [Validators.required]),
		// A control to hold the ID from the search bar
		priority: new FormControl<NameListItem | null>(null, [Validators.required]),
	});

	priorityList = signal<NameListItem[]>([]);
	projectUsernameList = signal<NameListItem[]>([]);

	get f() {
		return this.backlogForm.controls;
	}

	ngOnInit() {
		this.priorityList.set(this.dataService.priorityList());
		this.dataService
			.getProjectAssignedUsernames(this.projectId)
			.subscribe((result) => {
				this.projectUsernameList.set(result);
			});

		if (this.backlogData) {
			this.backlogForm.patchValue({
				backlogName: this.backlogData.backlogName,
				description: this.backlogData.description,
				dateRange: {
					start: this.backlogData.startDate
						? new Date(this.backlogData.startDate)
						: null,
					end: this.backlogData.targetDate
						? new Date(this.backlogData.targetDate)
						: null,
				},
				priority: {
					id: this.backlogData.priorityId,
					name: this.backlogData.priorityName,
				},
				pic: {
					id: this.backlogData.picId,
					name: this.backlogData.picName,
				},
			});
		}
	}

	newBacklogCreate() {
		if (this.backlogForm.valid) {
			// Form is valid, proceed with creating the project
			const newBacklog: NewBacklog = {
				projectId: this.projectId,
				backlogName: this.backlogForm.value.backlogName || "",
				description: this.backlogForm.value.description || "",
				createdBy: this.dataService.userIdSignal(),
				startDate: this.backlogForm.value.dateRange?.start || null,
				targetDate: this.backlogForm.value.dateRange?.end || null,
				picId: this.backlogForm.value.pic?.id || 0,
				priorityId: this.backlogForm.value.priority?.id || 0,
			};
			this.dataService.postNewBacklog(newBacklog).subscribe(() => {
				this.dialogService.getBacklogContainerDialogRef()?.close(true);
			});
		} else {
			this.backlogForm.markAllAsTouched();
		}
	}

	backlogEdit() {
		// 1. First, check if the form is valid
		if (!this.backlogForm.valid) {
			this.backlogForm.markAllAsTouched();
			return;
		}

		// 2. Build the payload, sending `null` for any value that hasn't changed.
		const alterBacklog: AlterBacklog = {
			backlogId: this.backlogData.backlogId,
			backlogName:
				this.backlogForm.value.backlogName === this.backlogData.backlogName
					? null
					: this.backlogForm.value.backlogName || null,
			description:
				this.backlogForm.value.description === this.backlogData.description
					? null
					: this.backlogForm.value.description || null,
			startDate:
				this.backlogForm.value.dateRange?.start &&
				this.backlogData.startDate &&
				new Date(this.backlogData.startDate).getTime() ===
					this.backlogForm.value.dateRange.start.getTime()
					? null
					: this.backlogForm.value.dateRange?.start || null,
			targetDate:
				this.backlogForm.value.dateRange?.end &&
				this.backlogData.targetDate &&
				new Date(this.backlogData.targetDate).getTime() ===
					this.backlogForm.value.dateRange.end.getTime()
					? null
					: this.backlogForm.value.dateRange?.end || null,
			picId:
				this.backlogForm.value.pic?.id === this.backlogData.picId
					? null
					: this.backlogForm.value.pic?.id || null,
			priorityId:
				this.backlogForm.value.priority?.id === this.backlogData.priorityId
					? null
					: this.backlogForm.value.priority?.id || null,
		};

		this.dataService.putAlterBacklog(alterBacklog).subscribe(() => {
			this.updateExistingBacklog();
		});
	}

	updateExistingBacklog() {
		this.backlogData.backlogName =
			this.backlogForm.value.backlogName || this.backlogData.backlogName;
		this.backlogData.description =
			this.backlogForm.value.description || this.backlogData.description;
		this.backlogData.startDate =
			this.backlogForm.value.dateRange?.start !== undefined &&
			this.backlogForm.value.dateRange?.start !== null
				? this.backlogForm.value.dateRange.start
				: this.backlogData.startDate;
		this.backlogData.targetDate =
			this.backlogForm.value.dateRange?.end !== undefined &&
			this.backlogForm.value.dateRange?.end !== null
				? this.backlogForm.value.dateRange.end
				: this.backlogData.targetDate;
		this.backlogData.picId =
			Number(this.backlogForm.value.pic) || this.backlogData.picId;
		this.backlogData.picName =
			this.backlogForm.value.pic?.name || this.backlogData.picName;
		this.backlogData.priorityId =
			this.backlogForm.value.priority?.id || this.backlogData.priorityId;
		this.backlogData.priorityName =
			this.backlogForm.value.priority?.name || this.backlogData.priorityName;
	}
}
