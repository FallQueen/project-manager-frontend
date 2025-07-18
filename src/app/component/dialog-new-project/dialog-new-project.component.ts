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
} from "@angular/forms";
import { NgIf } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SearchBarComponent } from "../search-bar/search-bar.component";

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
	],
	templateUrl: "./dialog-new-project.component.html",
	styleUrl: "./dialog-new-project.component.css",
	providers: [
		{ provide: DateAdapter, useClass: NativeDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
	],
})
export class DialogNewProjectComponent {
	newProject: NewProjectInput = {
		projectName: "",
		description: "",
		creatorId: 0,
		startDate: null,
		targetDate: null,
		picId: 0,
	};
	dateRange = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null),
	});

	checkDateRangeHasValue(): boolean {
		const { start, end } = this.dateRange.value;
		return !!start || !!end;
	}
}
