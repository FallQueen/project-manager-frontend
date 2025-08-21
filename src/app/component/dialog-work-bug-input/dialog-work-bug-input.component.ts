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
	NameListItem,
	NewWork,
	WorkData,
	BugData,
	NewBug,
	AlterBug,
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
import { DialogService } from "../../service/dialog.service";
import { BugPageService } from "../../service/bug-page.service";
import { SearchBarComponent } from "../search-bar/search-bar.component";

@Component({
	selector: "app-dialog-work-bug-input",
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
	templateUrl: "./dialog-work-bug-input.component.html",
	styleUrl: "./dialog-work-bug-input.component.css",
	providers: [
		{ provide: DateAdapter, useClass: NativeDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
	],
})
export class DialogWorkBugInputComponent {
	dataService = inject(DataProcessingService);
	bugPageService = inject(BugPageService);
	dialogService = inject(DialogService);
	@Input() currentPic = signal<NameListItem>({ name: "", id: 0 });
	@Input() subModuleId!: number;
	@Input() data!: WorkData | BugData;
	@Input() isBug = false;
	@Output() selectActivity = new EventEmitter<NameListItem>();
	@Output() edited = new EventEmitter<void>();

	// isBugPage = signal(this.dataService.isPage("bug"));
	trackerList = signal<NameListItem[]>([]);
	activityList = signal<NameListItem[]>([]);
	priorityList = signal<NameListItem[]>([]);
	stateList = signal<NameListItem[]>([]);

	nameTitle = signal(this.isBug ? "Bug Name" : "Work Name");
	defectCauseList = signal<NameListItem[]>([]);
	currentProjectWorkList = signal<NameListItem[]>([]);

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
		priority: new FormControl<NameListItem | null>(null, [
			this.isBug ? Validators.required : Validators.nullValidator,
		]),
		estimatedHours: new FormControl<number | null>(null, [Validators.required]),
		tracker: new FormControl<NameListItem | null>(null, [
			!this.isBug ? Validators.required : Validators.nullValidator,
		]),
		activity: new FormControl<NameListItem | null>(null, [
			!this.isBug ? Validators.required : Validators.nullValidator,
		]),
		defectCause: new FormControl<NameListItem | null>(null, [
			this.isBug ? Validators.required : Validators.nullValidator,
		]),
		workAffected: new FormControl<NameListItem | null>(null, [
			this.isBug ? Validators.required : Validators.nullValidator,
		]),
	});

	get f() {
		return this.workForm.controls;
	}

	ngOnInit() {
		this.trackerList.set(this.dataService.trackerList());
		this.activityList.set(this.dataService.activityList());
		this.priorityList.set(this.dataService.priorityList());
		this.stateList.set(this.dataService.stateList());
		this.trackerList.set(
			this.trackerList().filter((item) => item.name.toLowerCase() !== "bug"),
		);
		this.f.state.setValue(this.stateList()[0]);

		if (this.isBug) {
			this.dataService.getDefectCauseList().subscribe((result) => {
				this.defectCauseList.set(result);
			});

			this.dataService
				.getWorkNameListOfProjectDev(this.dataService.projectIdSignal())
				.subscribe((result) => {
					this.currentProjectWorkList.set(result);
				});
		}

		if (this.data) {
			this.workForm.patchValue({
				workName: this.data.workName,
				description: this.data.description,
				dateRange: {
					start: this.data.startDate ? new Date(this.data.startDate) : null,
					end: this.data.targetDate ? new Date(this.data.targetDate) : null,
				},
				pic: this.data.picName || "",
				state: { id: this.data.stateId, name: this.data.stateName },
				priority: {
					id: this.data.priorityId,
					name: this.data.priorityName,
				},
				estimatedHours: this.data.estimatedHours || 0,
				tracker: {
					id: this.data.trackerId,
					name: this.data.trackerName,
				},

				activity: {
					id: this.data.activityId,
					name: this.data.activityName,
				},
			});

			if (this.isBug) {
				const bugData = this.data as BugData;
				this.workForm.patchValue({
					defectCause: {
						name: bugData.defectCause || "",
						id: 0,
					},
					workAffected: {
						name: bugData.workAffected || "",
						id: 0,
					},
				});
			}

			this.currentPic().name = this.data.picName;
		}
	}

	onActivitySelected() {
		this.selectActivity.emit(this.f.activity.value ?? undefined);
	}
	newWorkOrBugCreate(usersAdded: number[]) {
		if (!this.workForm.valid) {
			this.workForm.markAllAsTouched();
			return;
		}

		if (this.isBug) {
			this.newBugCreate(usersAdded);
		} else {
			this.newWorkCreate(usersAdded);
		}
	}

	newWorkCreate(usersAdded: number[]) {
		const newWork: NewWork = {
			subModuleId: this.subModuleId,
			workName: this.workForm.value.workName || "",
			description: this.workForm.value.description || "",
			createdBy: this.dataService.userIdSignal(),
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

		this.dataService.postNewWork(newWork).subscribe(() => {
			this.dialogService
				.getWorkContainerDialogRef()
				?.close(this.workForm.value.state);
		});
	}

	newBugCreate(usersAdded: number[]) {
		const newBug: NewBug = {
			workName: this.workForm.value.workName || "",
			description: this.workForm.value.description || "",
			createdBy: this.dataService.userIdSignal(),
			startDate: this.workForm.value.dateRange?.start || null,
			targetDate: this.workForm.value.dateRange?.end || null,
			currentState: this.workForm.value.state?.id || 0,
			priorityId: this.workForm.value.priority?.id || 0,
			estimatedHours: this.workForm.value.estimatedHours || 0,
			usersAdded,
			picId: this.currentPic().id || null,
			defectCause: this.workForm.value.defectCause?.id || 0,
			workAffected: this.workForm.value.workAffected?.id || 0,
		};
		// console.log(newBug);
		this.dataService.postNewBug(newBug).subscribe(() => {
			this.bugPageService.setProjectBugs();
			this.dialogService.getWorkContainerDialogRef()?.close();
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

	editWorkOrBug(usersRemoved: number[], usersAdded: number[]) {
		if (!this.workForm.valid) {
			this.workForm.markAllAsTouched();
			return;
		}

		// Base payload for both work and bug
		const alterWork: AlterWork = {
			workId: this.data.workId,
			workName:
				this.workForm.value.workName === this.data.workName
					? null
					: this.workForm.value.workName || null,
			description:
				this.workForm.value.description === this.data.description
					? null
					: this.workForm.value.description || null,
			startDate:
				this.workForm.value.dateRange?.start &&
				new Date(this.data.startDate).getTime() ===
					this.workForm.value.dateRange.start.getTime()
					? null
					: this.workForm.value.dateRange?.start || null,
			targetDate:
				this.workForm.value.dateRange?.end &&
				new Date(this.data.targetDate).getTime() ===
					this.workForm.value.dateRange.end.getTime()
					? null
					: this.workForm.value.dateRange?.end || null,
			picId:
				this.currentPic().name === this.data.picName
					? null
					: this.currentPic().id || null,
			currentState:
				this.workForm.value.state?.id === this.data.stateId
					? null
					: this.workForm.value.state?.id || null,
			priorityId:
				this.workForm.value.priority?.id === this.data.priorityId
					? null
					: this.workForm.value.priority?.id || null,
			estimatedHours:
				this.workForm.value.estimatedHours === this.data.estimatedHours
					? null
					: (this.workForm.value.estimatedHours ?? null),
			trackerId:
				this.workForm.value.tracker?.id === this.data.trackerId
					? null
					: this.workForm.value.tracker?.id || null,
			activityId:
				this.workForm.value.activity?.id === this.data.activityId
					? null
					: this.workForm.value.activity?.id || null,
			usersAdded,
			usersRemoved,
		};

		// Add bug-specific fields if editing a bug
		if (this.isBug) {
			const alterBug: AlterBug = {
				...alterWork,
				defectCause: this.workForm.value.defectCause?.id || null,
				workAffected: this.workForm.value.workAffected?.id || null,
			};
			console.log("alterBug", alterBug);
			this.updateExistingWorkOrBug();
			this.dataService.putAlterBug(alterBug).subscribe();
		} else {
			this.updateExistingWorkOrBug();
			this.dataService.putAlterWork(alterWork).subscribe();
		}
	}

	updateExistingWorkOrBug() {
		this.data.workName = this.workForm.value.workName || this.data.workName;
		this.data.description =
			this.workForm.value.description || this.data.description;
		this.data.startDate =
			this.workForm.value.dateRange?.start !== undefined &&
			this.workForm.value.dateRange?.start !== null
				? this.workForm.value.dateRange.start
				: this.data.startDate;
		this.data.targetDate =
			this.workForm.value.dateRange?.end !== undefined &&
			this.workForm.value.dateRange?.end !== null
				? this.workForm.value.dateRange.end
				: this.data.targetDate;
		this.data.estimatedHours =
			this.workForm.value.estimatedHours ?? this.data.estimatedHours;
		this.data.picId = Number(this.workForm.value.pic) || this.data.picId;
		this.data.picName = this.currentPic().name;
		this.data.priorityId =
			this.workForm.value.priority?.id || this.data.priorityId;
		this.data.priorityName =
			this.workForm.value.priority?.name || this.data.priorityName;
		this.data.trackerId =
			this.workForm.value.tracker?.id || this.data.trackerId;
		this.data.trackerName =
			this.workForm.value.tracker?.name || this.data.trackerName;
		this.data.activityId =
			this.workForm.value.activity?.id || this.data.activityId;
		this.data.activityName =
			this.workForm.value.activity?.name || this.data.activityName;

		if ("workAffected" in this.data && "defectCause" in this.data) {
			this.data.workAffected =
				this.workForm.value.workAffected?.name || this.data.workAffected;
			this.data.defectCause =
				this.workForm.value.defectCause?.name || this.data.defectCause;
		}

		this.edited.emit();
	}
}
