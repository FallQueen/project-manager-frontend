import {
	Component,
	EventEmitter,
	inject,
	Output,
	signal,
	ViewChild,
} from "@angular/core";
import { DialogProjectInputComponent } from "../dialog-project-input/dialog-project-input.component";
import { DialogProjectDetailComponent } from "../dialog-project-detail/dialog-project-detail.component";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import type { NameListItem, Project } from "../../model/format.type";
import { SelectorUserProjectRoleComponent } from "../selector-user-project-role/selector-user-project-role.component";
import { MatButtonModule } from "@angular/material/button";
import { DialogRef } from "@angular/cdk/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogUtilButtonRowComponent } from "../dialog-util-button-row/dialog-util-button-row.component";
import { DialogUtilTitleComponent } from "../dialog-util-title/dialog-util-title.component";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-dialog-project-container",
	imports: [
		DialogProjectInputComponent,
		DialogProjectDetailComponent,
		SelectorUserProjectRoleComponent,
		MatButtonModule,
		MatIconModule,
		DialogUtilButtonRowComponent,
		DialogUtilTitleComponent,
	],
	templateUrl: "./dialog-project-container.component.html",
	styleUrl: "./dialog-project-container.component.css",
})
export class DialogProjectContainerComponent {
	dialogService = inject(DialogService);
	dataService = inject(DataProcessingService);
	dialogData = inject(MAT_DIALOG_DATA);
	currentPic = signal<NameListItem>({ name: "", id: 0 });
	editable = signal<boolean>(false);
	@Output() updatedProject = new EventEmitter<Project>();
	@ViewChild(DialogProjectInputComponent)
	DialogProjectInputComponent!: DialogProjectInputComponent;
	@ViewChild(SelectorUserProjectRoleComponent)
	UserSelector!: SelectorUserProjectRoleComponent;

	toggleEdit() {
		this.editable.set(!this.editable());
	}

	triggerNewProjectSubmit() {
		console.log("trigger in container");
		this.DialogProjectInputComponent.newProjectCreate(
			this.UserSelector.getCurrentArrayChanges(),
		);
	}

	triggerEditProjectSubmit() {
		this.DialogProjectInputComponent.projectEdit(
			this.UserSelector.getCurrentArrayChanges(),
		);
		this.toggleEdit();
	}

	triggerDeleteProject() {
		this.dataService
			.dropProject(this.dialogData?.projectData?.projectId)
			.subscribe(() => {
				this.dialogService
					.getProjectContainerDialogRef()
					?.close({ drop: this.dialogData?.projectData?.projectId });
			});
	}
}
