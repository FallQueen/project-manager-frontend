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
	dataService = inject(DataProcessingService);
	dialogData = inject(MAT_DIALOG_DATA);
	currentPic = signal<NameListItem>({ name: "", id: 0 });
	editable = signal<boolean>(false);
	@Output() updatedProject = new EventEmitter<Project>();
	@ViewChild(DialogProjectInputComponent)
	dialogNewProject!: DialogProjectInputComponent;
	@ViewChild(SelectorUserProjectRoleComponent)
	UserSelector!: SelectorUserProjectRoleComponent;
	dialogRef = inject(DialogRef<DialogProjectContainerComponent>);

	triggerNewProjectSubmit() {
		this.dialogNewProject.newProjectCreate(
			this.UserSelector.getCurrentArrayChanges(),
		);
	}

	triggerEditProjectSubmit() {
		this.dialogNewProject.projectEdit(
			this.UserSelector.getCurrentArrayChanges(),
		);
		this.toggleEdit();
	}

	toggleEdit() {
		this.editable.set(!this.editable());
	}

	// updateProject() {
	// 	this.toggleEdit();
	// }
}
