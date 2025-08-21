import { Component, inject, signal, Input } from "@angular/core";
import { MatOptionModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import type {
	ModuleData,
	NameListItem,
	NewModule,
	AlterModule,
} from "../../model/format.type";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DataProcessingService } from "../../service/data-processing.service";
import { TextFieldModule } from "@angular/cdk/text-field";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-dialog-module-input",
	standalone: true,
	imports: [
		CommonModule,
		MatInputModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatButtonModule,
		TextFieldModule,
	],
	templateUrl: "./dialog-module-input.component.html",
	styleUrls: ["./dialog-module-input.component.css"],
})
export class DialogModuleInputComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	projectId = this.dataService.projectIdSignal();
	@Input() moduleData!: ModuleData;

	moduleForm = new FormGroup({
		moduleName: new FormControl("", [Validators.required]),
		description: new FormControl("", [Validators.required]),
	});

	priorityList = signal<NameListItem[]>([]);

	get f() {
		return this.moduleForm.controls;
	}

	ngOnInit() {
		this.priorityList.set(this.dataService.priorityList());
		if (this.moduleData) {
			this.moduleForm.patchValue({
				moduleName: this.moduleData.moduleName,
				description: this.moduleData.description,
			});
		}
	}

	newModuleCreate() {
		if (this.moduleForm.valid) {
			const newModule: NewModule = {
				projectId: this.projectId,
				ModuleName: this.moduleForm.value.moduleName || "",
				description: this.moduleForm.value.description || "",
				createdBy: this.dataService.userIdSignal(),
			};
			this.dataService.postNewModule(newModule).subscribe(() => {
				this.dialogService.getModuleContainerDialogRef()?.close(true);
			});
		} else {
			this.moduleForm.markAllAsTouched();
		}
	}

	moduleEdit() {
		if (!this.moduleForm.valid) {
			this.moduleForm.markAllAsTouched();
			return;
		}
		const alter: AlterModule = {
			ModuleId: this.moduleData.moduleId,
			ModuleName:
				this.moduleForm.value.moduleName === this.moduleData.moduleName
					? null
					: this.moduleForm.value.moduleName || null,
			description:
				this.moduleForm.value.description === this.moduleData.description
					? null
					: this.moduleForm.value.description || null,
		};
		console.log("Updating module:", alter);
		this.dataService.putAlterModule(alter).subscribe();
		this.updateExistingSubModule();
	}

	updateExistingSubModule() {
		this.moduleData.moduleName =
			this.moduleForm.value.moduleName || this.moduleData.moduleName;
		this.moduleData.description =
			this.moduleForm.value.description || this.moduleData.description;
	}
}
