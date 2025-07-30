import {
	Component,
	EventEmitter,
	inject,
	Output,
	signal,
	ViewChild,
} from "@angular/core";
import { DialogProjectEditComponent } from "../dialog-project-edit/dialog-project-edit.component";
import { DialogProjectDetailComponent } from "../dialog-project-detail/dialog-project-detail.component";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import type { NameListItem, Project } from "../../model/format.type";
import { SelectorUserProjectRoleComponent } from "../selector-user-project-role/selector-user-project-role.component";
import { MatButtonModule } from "@angular/material/button";
import { DialogRef } from "@angular/cdk/dialog";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-dialog-project-container",
	imports: [
		DialogProjectEditComponent,
		DialogProjectDetailComponent,
		SelectorUserProjectRoleComponent,
		MatButtonModule,
		MatIconModule,
		MatDialogClose,
	],
	templateUrl: "./dialog-project-container.component.html",
	styleUrl: "./dialog-project-container.component.css",
})
export class DialogProjectContainerComponent {
	dialogData = inject(MAT_DIALOG_DATA);
	currentPic = signal<NameListItem>({ name: "", id: 0 });
	editable = signal<boolean>(false);
	@Output() updatedProject = new EventEmitter<Project>();
	@ViewChild(DialogProjectEditComponent)
	dialogNewProject!: DialogProjectEditComponent;
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
