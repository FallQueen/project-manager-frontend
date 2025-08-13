import { Component, inject, signal, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogSubModuleInputComponent } from "../dialog-sub-module-input/dialog-sub-module-input.component";
import { MatButtonModule } from "@angular/material/button";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogUtilButtonRowComponent } from "../dialog-util-button-row/dialog-util-button-row.component";
import { DialogUtilTitleComponent } from "../dialog-util-title/dialog-util-title.component";
import { DialogService } from "../../service/dialog.service";
import { DialogSubModuleDetailComponent } from "../dialog-sub-module-detail/dialog-sub-module-detail.component";

@Component({
	selector: "app-dialog-sub-module-container",
	imports: [
		MatIconModule,
		DialogSubModuleDetailComponent,
		DialogSubModuleInputComponent,
		MatButtonModule,
		DialogUtilButtonRowComponent,
		DialogUtilTitleComponent,
	],
	templateUrl: "./dialog-sub-module-container.component.html",
	styleUrl: "./dialog-sub-module-container.component.css",
})
export class DialogSubModuleContainerComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	dialogData = inject(MAT_DIALOG_DATA);
	editable = signal<boolean>(false);

	@ViewChild(DialogSubModuleInputComponent)
	DialogSubModuleInput!: DialogSubModuleInputComponent;

	ngOnInit() {}

	toggleEdit() {
		this.editable.set(!this.editable());
	}

	triggerNewSubModuleSubmit() {
		this.DialogSubModuleInput.newSubModuleCreate();
	}
	triggerEditSubModuleSubmit() {
		this.DialogSubModuleInput.subModuleEdit();
		this.toggleEdit();
	}

	triggerDeleteSubModule() {
		this.dataService
			.dropSubModule(this.dialogData?.subModuleData?.subModuleId)
			.subscribe(() => {
				this.dialogService
					.getSubModuleContainerDialogRef()
					?.close({ drop: this.dialogData?.subModuleData?.subModuleId });
			});
	}
}
