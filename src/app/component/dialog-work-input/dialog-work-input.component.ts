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
	AlterWork,
	BacklogData,
	NameListItem,
	NewWork,
	WorkData,
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
import { MatDialogRef } from "@angular/material/dialog";
import type { DialogWorkContainerComponent } from "../dialog-work-container/dialog-work-container.component";

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
	@Input() currentPic = signal<NameListItem>({ name: "", id: 0 });
	@Input() backlogId!: number;
	@Input() work!: WorkData;
	@Output() selectActivity = new EventEmitter<NameListItem>();
	@Output()
	containerDialogRef = inject(MatDialogRef<DialogWorkContainerComponent>);

	trackerList = signal<NameListItem[]>([]);
	activityList = signal<NameListItem[]>([]);
	priorityList = signal<NameListItem[]>([]);
	stateList = signal<NameListItem[]>([]);

	workForm = new FormGroup({
		workName: new FormControl("", [Validators.required]),
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
		return this.workForm.controls;
	}

	ngOnInit() {
		this.trackerList.set(this.dataService.getTrackerList());
		this.activityList.set(this.dataService.getActivityList());
		this.priorityList.set(this.dataService.getPriorityList());
		this.stateList.set(this.dataService.getStateList());
		this.trackerList.set(
			this.trackerList().filter((item) => item.name.toLowerCase() !== "bug"),
		);
		this.f.state.setValue(this.stateList()[0]);

		if (this.work) {
			this.workForm.patchValue({
				workName: this.work.workName,
				description: this.work.description,
				dateRange: {
					start: this.work.startDate ? new Date(this.work.startDate) : null,
					end: this.work.targetDate ? new Date(this.work.targetDate) : null,
				},
				pic: this.work.picName || "",
				state: { id: this.work.stateId, name: this.work.stateName },
				priority: { id: this.work.priorityId, name: this.work.priorityName },
				estimatedHours: this.work.estimatedHours || 0,
				tracker: { id: this.work.trackerId, name: this.work.trackerName },

				activity: { id: this.work.activityId, name: this.work.activityName },
			});
			this.currentPic().name = this.work.picName;
		}
	}

	onActivitySelected() {
		this.selectActivity.emit(this.f.activity.value ?? undefined);
	}
	newWorkCreate(usersAdded: number[]) {
		if (!this.workForm.valid) {
			this.workForm.markAllAsTouched();
			return;
		}

		// Form is valid, proceed with creating the project
		const newWork: NewWork = {
			backlogId: this.backlogId,
			workName: this.workForm.value.workName || "",
			description: this.workForm.value.description || "",
			createdBy: Number(this.dataService.getUserId()),
			startDate: this.workForm.value.dateRange?.start || null,
			targetDate: this.workForm.value.dateRange?.end || null,
			currentState: this.workForm.value.state?.id || 0,
			priorityId: this.workForm.value.priority?.id || 0,
			estimatedHours: this.workForm.value.estimatedHours || 0,
			trackerId: this.workForm.value.tracker?.id || 0,
			activityId: this.workForm.value.activity?.id || 0,
			usersAdded,
			picId: this.currentPic().id || null,
		};
		console.log("New Work Data:", newWork);
		this.dataService.postNewWork(newWork).subscribe(() => {
			this.containerDialogRef.close(this.workForm.value.state);
		});
	}

	changeState(empty: boolean) {
		if (empty) {
			this.f.state.setValue(this.stateList()[0]);
		} else {
			this.f.state.setValue(this.stateList()[1]);
		}
	}

	displayName(nameItem: NameListItem): string {
		return nameItem?.name ? nameItem.name : "";
	}

	workEdit(usersRemoved: number[], usersAdded: number[]) {
		// 1. First, check if the form is valid
		if (!this.workForm.valid) {
			this.workForm.markAllAsTouched();
			return;
		}

		// 2. Build the payload, sending `null` for any value that hasn't changed.
		const alterWork: AlterWork = {
			workId: this.work.workId,
			workName:
				this.workForm.value.workName === this.work.workName
					? null
					: this.workForm.value.workName || null,
			description:
				this.workForm.value.description === this.work.description
					? null
					: this.workForm.value.description || null,
			startDate:
				this.workForm.value.dateRange?.start &&
				new Date(this.work.startDate).getTime() ===
					this.workForm.value.dateRange.start.getTime()
					? null
					: this.workForm.value.dateRange?.start || null,
			targetDate:
				this.workForm.value.dateRange?.end &&
				new Date(this.work.targetDate).getTime() ===
					this.workForm.value.dateRange.end.getTime()
					? null
					: this.workForm.value.dateRange?.end || null,
			picId:
				this.currentPic().name === this.work.picName
					? null
					: this.currentPic().id || null,
			priorityId:
				this.workForm.value.priority?.id === this.work.priorityId
					? null
					: this.workForm.value.priority?.id || null,
			estimatedHours:
				this.workForm.value.estimatedHours === this.work.estimatedHours
					? null
					: (this.workForm.value.estimatedHours ?? null),
			trackerId:
				this.workForm.value.tracker?.id === this.work.trackerId
					? null
					: this.workForm.value.tracker?.id || null,
			activityId:
				this.workForm.value.activity?.id === this.work.activityId
					? null
					: this.workForm.value.activity?.id || null,
			usersAdded,
			usersRemoved,
		};

		console.log("Payload to be sent:", alterWork);
		this.dataService.putAlterWork(alterWork).subscribe(() => {
			this.updateExistingWork();
		});
	}

	updateExistingWork() {
		this.work.workName = this.workForm.value.workName || this.work.workName;
		this.work.description =
			this.workForm.value.description || this.work.description;
		this.work.startDate =
			this.workForm.value.dateRange?.start !== undefined &&
			this.workForm.value.dateRange?.start !== null
				? this.workForm.value.dateRange.start
				: this.work.startDate;
		this.work.targetDate =
			this.workForm.value.dateRange?.end !== undefined &&
			this.workForm.value.dateRange?.end !== null
				? this.workForm.value.dateRange.end
				: this.work.targetDate;
		this.work.estimatedHours =
			this.workForm.value.estimatedHours ?? this.work.estimatedHours;
		this.work.picId = Number(this.workForm.value.pic) || this.work.picId;
		this.work.picName = this.currentPic.name;
		this.work.priorityId =
			this.workForm.value.priority?.id || this.work.priorityId;
		this.work.priorityName =
			this.workForm.value.priority?.name || this.work.priorityName;
		this.work.trackerId =
			this.workForm.value.tracker?.id || this.work.trackerId;
		this.work.trackerName =
			this.workForm.value.tracker?.name || this.work.trackerName;
		this.work.activityId =
			this.workForm.value.activity?.id || this.work.activityId;
		this.work.activityName =
			this.workForm.value.activity?.name || this.work.activityName;
	}
}
