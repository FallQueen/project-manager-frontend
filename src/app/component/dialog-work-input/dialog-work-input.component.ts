import { Component, inject, signal, Input } from "@angular/core";
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_NATIVE_DATE_FORMATS,
	MatNativeDateModule,
	NativeDateAdapter,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatError, MatInputModule } from "@angular/material/input";
import type { NameListItem, Project } from "../../model/format.type";
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
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TextFieldModule } from "@angular/cdk/text-field";

@Component({
	selector: "app-dialog-work-input",
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

	workForm = new FormGroup({
		workName: new FormControl("", [Validators.required]),
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
		return this.workForm.controls;
	}

	checkDateRangeHasValue(): boolean {
		const dateRangeGroup = this.workForm.get("dateRange");

		if (dateRangeGroup) {
			const { start, end } = dateRangeGroup.value;
			return !!start || !!end;
		}

		return false;
	}
}
