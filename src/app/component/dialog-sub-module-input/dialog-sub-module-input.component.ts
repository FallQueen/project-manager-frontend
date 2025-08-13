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
	SubModuleData,
	NameListItem,
	NewSubModule,
	AlterSubModule,
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
	selector: "app-dialog-sub-module-input",
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
	templateUrl: "./dialog-sub-module-input.component.html",
	styleUrl: "./dialog-sub-module-input.component.css",
	providers: [
		{ provide: DateAdapter, useClass: NativeDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
	],
})
export class DialogSubModuleInputComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	projectId = this.dataService.projectIdSignal();
	@Input() subModuleData!: SubModuleData;

	subModuleForm = new FormGroup({
		subModuleName: new FormControl("", [Validators.required]),
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
		return this.subModuleForm.controls;
	}

	ngOnInit() {
		this.priorityList.set(this.dataService.priorityList());
		this.dataService
			.getProjectAssignedUsernames(this.projectId)
			.subscribe((result) => {
				this.projectUsernameList.set(result);
			});

		if (this.subModuleData) {
			this.subModuleForm.patchValue({
				subModuleName: this.subModuleData.subModuleName,
				description: this.subModuleData.description,
				dateRange: {
					start: this.subModuleData.startDate
						? new Date(this.subModuleData.startDate)
						: null,
					end: this.subModuleData.targetDate
						? new Date(this.subModuleData.targetDate)
						: null,
				},
				priority: {
					id: this.subModuleData.priorityId,
					name: this.subModuleData.priorityName,
				},
				pic: {
					id: this.subModuleData.picId,
					name: this.subModuleData.picName,
				},
			});
		}
	}

	newSubModuleCreate() {
		if (this.subModuleForm.valid) {
			// Form is valid, proceed with creating the project
			const newSubModule: NewSubModule = {
				projectId: this.projectId,
				subModuleName: this.subModuleForm.value.subModuleName || "",
				description: this.subModuleForm.value.description || "",
				createdBy: this.dataService.userIdSignal(),
				startDate: this.subModuleForm.value.dateRange?.start || null,
				targetDate: this.subModuleForm.value.dateRange?.end || null,
				picId: this.subModuleForm.value.pic?.id || 0,
				priorityId: this.subModuleForm.value.priority?.id || 0,
			};
			this.dataService.postNewSubModule(newSubModule).subscribe(() => {
				this.dialogService.getSubModuleContainerDialogRef()?.close(true);
			});
		} else {
			this.subModuleForm.markAllAsTouched();
		}
	}

	subModuleEdit() {
		// 1. First, check if the form is valid
		if (!this.subModuleForm.valid) {
			this.subModuleForm.markAllAsTouched();
			return;
		}

		// 2. Build the payload, sending `null` for any value that hasn't changed.
		const alterSubModule: AlterSubModule = {
			subModuleId: this.subModuleData.subModuleId,
			subModuleName:
				this.subModuleForm.value.subModuleName ===
				this.subModuleData.subModuleName
					? null
					: this.subModuleForm.value.subModuleName || null,
			description:
				this.subModuleForm.value.description === this.subModuleData.description
					? null
					: this.subModuleForm.value.description || null,
			startDate:
				this.subModuleForm.value.dateRange?.start &&
				this.subModuleData.startDate &&
				new Date(this.subModuleData.startDate).getTime() ===
					this.subModuleForm.value.dateRange.start.getTime()
					? null
					: this.subModuleForm.value.dateRange?.start || null,
			targetDate:
				this.subModuleForm.value.dateRange?.end &&
				this.subModuleData.targetDate &&
				new Date(this.subModuleData.targetDate).getTime() ===
					this.subModuleForm.value.dateRange.end.getTime()
					? null
					: this.subModuleForm.value.dateRange?.end || null,
			picId:
				this.subModuleForm.value.pic?.id === this.subModuleData.picId
					? null
					: this.subModuleForm.value.pic?.id || null,
			priorityId:
				this.subModuleForm.value.priority?.id === this.subModuleData.priorityId
					? null
					: this.subModuleForm.value.priority?.id || null,
		};

		this.dataService.putAlterSubModule(alterSubModule).subscribe(() => {
			this.updateExistingSubModule();
		});
	}

	updateExistingSubModule() {
		this.subModuleData.subModuleName =
			this.subModuleForm.value.subModuleName ||
			this.subModuleData.subModuleName;
		this.subModuleData.description =
			this.subModuleForm.value.description || this.subModuleData.description;
		this.subModuleData.startDate =
			this.subModuleForm.value.dateRange?.start !== undefined &&
			this.subModuleForm.value.dateRange?.start !== null
				? this.subModuleForm.value.dateRange.start
				: this.subModuleData.startDate;
		this.subModuleData.targetDate =
			this.subModuleForm.value.dateRange?.end !== undefined &&
			this.subModuleForm.value.dateRange?.end !== null
				? this.subModuleForm.value.dateRange.end
				: this.subModuleData.targetDate;
		this.subModuleData.picId =
			Number(this.subModuleForm.value.pic) || this.subModuleData.picId;
		this.subModuleData.picName =
			this.subModuleForm.value.pic?.name || this.subModuleData.picName;
		this.subModuleData.priorityId =
			this.subModuleForm.value.priority?.id || this.subModuleData.priorityId;
		this.subModuleData.priorityName =
			this.subModuleForm.value.priority?.name ||
			this.subModuleData.priorityName;
	}
}
