import { Component, inject, signal, ViewChild, viewChild } from "@angular/core";
import { DialogNewProjectComponent } from "../dialog-new-project/dialog-new-project.component";
import { DialogProjectDetailComponent } from "../dialog-project-detail/dialog-project-detail.component";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import type { NameListItem } from "../../model/format.type";
import { UserSelectorComponent } from "../user-selector/user-selector.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-dialog-project-container",
	imports: [
		DialogNewProjectComponent,
		DialogProjectDetailComponent,
		UserSelectorComponent,
		MatButtonModule,
	],
	templateUrl: "./dialog-project-container.component.html",
	styleUrl: "./dialog-project-container.component.css",
})
export class DialogProjectContainerComponent {
	dialogData = inject(MAT_DIALOG_DATA);
	currentPic = signal<NameListItem>({ name: "", id: 0 });
	editable = signal<boolean>(false);
	@ViewChild(DialogNewProjectComponent)
	dialogNewProject!: DialogNewProjectComponent;
	@ViewChild(UserSelectorComponent)
	UserSelector!: UserSelectorComponent;

	triggerNewProjectSubmit() {
		this.dialogNewProject.newProjectCreate(
			this.UserSelector.getCurrentArrayChanges(),
		);
	}

	triggerEditProjectSubmit() {
		this.dialogNewProject.projectEdit(
			this.UserSelector.getCurrentArrayChanges(),
		);
	}

	changeToEdit() {
		this.editable.set(!this.editable());
	}
}
