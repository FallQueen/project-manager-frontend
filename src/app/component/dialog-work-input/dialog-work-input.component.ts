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
import type { NameListItem, NewWork, Project } from "../../model/format.type";
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
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TextFieldModule } from "@angular/cdk/text-field";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@Component({
	selector: "app-dialog-work-input",
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
	],
	templateUrl: "./dialog-work-input.component.html",
	styleUrl: "./dialog-work-input.component.css",
	providers: [
		{ provide: DateAdapter, useClass: NativeDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
	],
})
export class DialogWorkInputComponent {
	dataService = inject(DataProcessingService);
	dialogData = inject(MAT_DIALOG_DATA);
	@Input() currentPic = signal<NameListItem>({ name: "", id: 0 });
	@Input() project!: Project;
	@Output() selectActivity = new EventEmitter<NameListItem>();
	trackerList = signal<NameListItem[]>([]);
	activityList = signal<NameListItem[]>([]);
	priorityList = signal<NameListItem[]>([]);

	workForm = new FormGroup({
		workName: new FormControl("", [Validators.required]),
		description: new FormControl("", [Validators.required]),
		// A nested group for the date range
		dateRange: new FormGroup({
			start: new FormControl<Date | null>(null, [Validators.required]),
			end: new FormControl<Date | null>(null, [Validators.required]),
		}),
		// A control to hold the ID from the search bar
		state: new FormControl<string | null>(null, [Validators.required]),
		pic: new FormControl<string | null>(null, [Validators.required]),
		priority: new FormControl<NameListItem | null>(null, [Validators.required]),
		estimatedHours: new FormControl<number | null>(null, [Validators.required]),
		tracker: new FormControl<NameListItem | null>(null, [Validators.required]),
		activity: new FormControl<NameListItem | null>(null, [Validators.required]),
	});

	get f() {
		return this.workForm.controls;
	}

	ngOnInit() {
		this.trackerList.set(this.dataService.getTrackerList());
		this.activityList.set(this.dataService.getActivityList());
		this.priorityList.set(this.dataService.getPriorityList());
	}

	onActivitySelected() {
		this.selectActivity.emit(this.f.activity.value ?? undefined);
	}
	newProjectCreate(usersAdded: number[]) {
		if (this.workForm.valid) {
			// Form is valid, proceed with creating the project
			const newWork: NewWork = {
				workName: this.workForm.value.workName || "",
				description: this.workForm.value.description || "",
				createdBy: Number(this.dataService.getUserId()),
				startDate: this.workForm.value.dateRange?.start || null,
				targetDate: this.workForm.value.dateRange?.end || null,
				priorityId: this.workForm.value.priority?.id || 0,
				estimatedHours: this.workForm.value.estimatedHours || 0,
				trackerId: this.workForm.value.tracker?.id || 0,
				activityId: this.workForm.value.activity?.id || 0,
				usersAdded,
				picId: this.currentPic().id || null,
			};

			// this.dataService.postNewWork(newWork).subscribe(() => {
			// 	this.containerDialogRef.close();
			// });
		} else {
			this.workForm.markAllAsTouched();
		}
	}

	displayName(nameItem: NameListItem): string {
		return nameItem?.name ? nameItem.name : "";
	}
}
