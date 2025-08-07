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
	NativeDateAdapter,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatError, MatInputModule } from "@angular/material/input";
import type {
	AlterProject,
	NameListItem,
	NewProjectInput,
	Project,
	UserRoleChange,
} from "../../model/format.type";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { NgIf } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatDialogRef } from "@angular/material/dialog";
import { TextFieldModule } from "@angular/cdk/text-field";
import type { DialogProjectContainerComponent } from "../dialog-project-container/dialog-project-container.component";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-dialog-project-input",
	imports: [
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
	],
	templateUrl: "./dialog-project-input.component.html",
	styleUrl: "./dialog-project-input.component.css",
	providers: [
		{ provide: DateAdapter, useClass: NativeDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
	],
})
export class DialogProjectInputComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	@Input() currentPic = signal<NameListItem>({ name: "", id: 0 });
	@Input() projectData!: Project;

	projectForm = new FormGroup({
		projectName: new FormControl("", [Validators.required]),
		description: new FormControl("", [Validators.required]),
		// A nested group for the date range
		dateRange: new FormGroup({
			start: new FormControl<Date | null>(null, [Validators.required]),
			end: new FormControl<Date | null>(null, [Validators.required]),
		}),
		// A control to hold the ID from the search bar
		picId: new FormControl<number | null>(null, [Validators.required]),
	});

	get f() {
		return this.projectForm.controls;
	}

	ngOnInit() {
		if (this.projectData) {
			this.projectForm.patchValue({
				projectName: this.projectData.projectName,
				description: this.projectData.description,
				dateRange: {
					start: this.projectData.startDate
						? new Date(this.projectData.startDate)
						: null,
					end: this.projectData.targetDate
						? new Date(this.projectData.targetDate)
						: null,
				},
				picId: 0,
			});
			this.currentPic().name = this.projectData.picName;
		}
	}
	checkDateRangeHasValue(): boolean {
		const dateRangeGroup = this.projectForm.get("dateRange");

		if (dateRangeGroup) {
			const { start, end } = dateRangeGroup.value;
			return !!start || !!end;
		}

		return false;
	}

	newProjectCreate(userRoles: UserRoleChange[]) {
		if (this.projectForm.valid) {
			// Form is valid, proceed with creating the project
			const newProject: NewProjectInput = {
				projectName: this.projectForm.value.projectName || "",
				description: this.projectForm.value.description || "",
				createdBy: Number(this.dataService.getUserId()),
				startDate: this.projectForm.value.dateRange?.start || null,
				targetDate: this.projectForm.value.dateRange?.end || null,
				userRoles,
				picId: this.currentPic().id,
			};
			this.dataService.postNewProject(newProject).subscribe(() => {
				this.dialogService.getProjectContainerDialogRef()?.close();
			});
		} else {
			this.projectForm.markAllAsTouched();
		}
	}

	projectEdit(userRoles: UserRoleChange[]) {
		if (this.projectForm.valid) {
			const alterProject: AlterProject = {
				projectId: this.projectData.projectId,
				projectName:
					this.projectForm.value.projectName === this.projectData.projectName
						? null
						: this.projectForm.value.projectName || null,
				description:
					this.projectForm.value.description === this.projectData.description
						? null
						: this.projectForm.value.description || null,
				startDate:
					this.projectForm.value.dateRange?.start &&
					new Date(this.projectData.startDate).getTime() ===
						this.projectForm.value.dateRange.start.getTime()
						? null
						: this.projectForm.value.dateRange?.start || null,
				targetDate:
					this.projectForm.value.dateRange?.end &&
					new Date(this.projectData.targetDate).getTime() ===
						this.projectForm.value.dateRange.end.getTime()
						? null
						: this.projectForm.value.dateRange?.end || null,
				userRoles,
				picId: this.currentPic().id === 0 ? null : this.currentPic().id,
			};

			// Update the local project object with either the same or new values

			this.dataService.putAlterProject(alterProject).subscribe(() => {
				this.updateExistingProject();
			});
		} else {
			this.projectForm.markAllAsTouched();
		}
	}

	updateExistingProject() {
		this.projectData.projectName =
			this.projectForm.value.projectName || this.projectData.projectName;
		this.projectData.description =
			this.projectForm.value.description || this.projectData.description;
		this.projectData.startDate =
			this.projectForm.value.dateRange?.start || this.projectData.startDate;
		this.projectData.targetDate =
			this.projectForm.value.dateRange?.end || this.projectData.targetDate;
		this.projectData.picName =
			this.currentPic().name || this.projectData.picName;
	}

	dropProject() {
		this.dataService.dropProject(this.projectData.projectId).subscribe(() => {
			this.dialogService
				.getProjectContainerDialogRef()
				?.close({ drop: this.projectData.projectId });
		});
	}
}
