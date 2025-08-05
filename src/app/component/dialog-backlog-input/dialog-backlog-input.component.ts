import {
	Component,
	inject,
	signal,
	Input,
	Output,
	EventEmitter,
} from "@angular/core";
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
	AlterProject,
	BacklogData,
	NameListItem,
	NewBacklog,
	UserRoleChange,
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
import { MatDialogRef } from "@angular/material/dialog";
import { TextFieldModule } from "@angular/cdk/text-field";
import type { DialogBacklogContainerComponent } from "../dialog-backlog-container/dialog-backlog-container.component";
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
	projectId = this.dataService.getProjectId();
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
		this.priorityList.set(this.dataService.getPriorityList()());
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
				createdBy: Number(this.dataService.getUserId()),
				startDate: this.backlogForm.value.dateRange?.start || null,
				targetDate: this.backlogForm.value.dateRange?.end || null,
				picId: this.backlogForm.value.pic?.id || 0,
				priorityId: this.backlogForm.value.priority?.id || 0,
			};
			this.dataService.postNewBacklog(newBacklog).subscribe(() => {
				this.dialogService.getBacklogContainerDialogRef()?.close();
			});
		} else {
			this.backlogForm.markAllAsTouched();
		}
	}
}
