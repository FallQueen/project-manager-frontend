import { Component } from "@angular/core";
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_NATIVE_DATE_FORMATS,
	MatNativeDateModule,
	NativeDateAdapter,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatError, MatInputModule } from "@angular/material/input";
import type { NewProjectInput } from "../../model/format.type";
import {
	FormControl,
	FormGroup,
	FormsModule,
	NgModel,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { NgIf } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { MatButtonModule } from "@angular/material/button";
import { UserSelectorComponent } from "../user-selector/user-selector.component";

@Component({
	selector: "app-dialog-new-project",
	imports: [
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatError,
		FormsModule,
		NgIf,
		MatFormFieldModule,
		ReactiveFormsModule,
		SearchBarComponent,
		MatButtonModule,
		UserSelectorComponent,
	],
	templateUrl: "./dialog-new-project.component.html",
	styleUrl: "./dialog-new-project.component.css",
	providers: [
		{ provide: DateAdapter, useClass: NativeDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
	],
})
export class DialogNewProjectComponent {
	// newProject: NewProjectInput = {
	// 	projectName: "",
	// 	description: "",
	// 	creatorId: 0,
	// 	startDate: null,
	// 	targetDate: null,
	// 	picId: 0,
	// };

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
	checkDateRangeHasValue(): boolean {
		const dateRangeGroup = this.projectForm.get("dateRange");

		if (dateRangeGroup) {
			const { start, end } = dateRangeGroup.value;
			return !!start || !!end;
		}

		return false;
	}

	onCreateClick(): void {
		if (this.projectForm.valid) {
			// Form is valid, proceed with creating the project
			console.log("Form is valid. Submitting:", this.projectForm.value);
		} else {
			console.log("Form is invalid. Marking all as touched.");
			this.projectForm.markAllAsTouched();
		}
	}
}
