import { Component, inject, signal, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
// Importing sibling standalone components
import { MatButtonModule } from "@angular/material/button";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogUtilButtonRowComponent } from "../dialog-util-button-row/dialog-util-button-row.component";
import { DialogUtilTitleComponent } from "../dialog-util-title/dialog-util-title.component";
import { DialogService } from "../../service/dialog.service";
import { DialogModuleDetailComponent } from "../dialog-module-detail/dialog-module-detail.component";
import { DialogModuleInputComponent } from "../dialog-module-input/dialog-module-input.component";

@Component({
	selector: "app-dialog-module-container",
	standalone: true,
	imports: [
		MatIconModule,
		DialogModuleDetailComponent,
		DialogModuleInputComponent,
		MatButtonModule,
		DialogUtilButtonRowComponent,
		DialogUtilTitleComponent,
	],
	templateUrl: "./dialog-module-container.component.html",
	styleUrls: ["./dialog-module-container.component.css"],
})
export class DialogModuleContainerComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	dialogData = inject(MAT_DIALOG_DATA);
	editable = signal<boolean>(false);

	@ViewChild(DialogModuleInputComponent)
	DialogModuleInput!: DialogModuleInputComponent;

	toggleEdit() {
		this.editable.set(!this.editable());
	}

	triggerNewModuleSubmit() {
		if (this.DialogModuleInput) {
			this.DialogModuleInput.newModuleCreate();
		}
	}
	triggerEditModuleSubmit() {
		this.DialogModuleInput.moduleEdit();
		this.toggleEdit();
	}
	triggerDeleteModule() {
		this.dataService
			.dropModule(this.dialogData?.moduleData?.moduleId)
			.subscribe(() => {
				this.dialogService
					.getModuleContainerDialogRef()
					?.close({ drop: this.dialogData?.moduleData?.moduleId });
			});
	}
}
