import { inject, Injectable } from "@angular/core";
import { MatDialog, type MatDialogRef } from "@angular/material/dialog";
import { DialogBacklogContainerComponent } from "../component/dialog-backlog-container/dialog-backlog-container.component";
import type { BacklogData, Project, WorkData } from "../model/format.type";
import { DialogProjectContainerComponent } from "../component/dialog-project-container/dialog-project-container.component";
import { DialogWorkContainerComponent } from "../component/dialog-work-container/dialog-work-container.component";
import { DialogUtilityComponent } from "../component/dialog-utility/dialog-utility.component";

@Injectable({
	providedIn: "root",
})
export class DialogService {
	private dialog = inject(MatDialog);
	private projectContainerDialogRef: MatDialogRef<DialogProjectContainerComponent> | null =
		null;
	private backlogContainerDialogRef: MatDialogRef<DialogBacklogContainerComponent> | null =
		null;
	private workContainerDialogRef: MatDialogRef<DialogWorkContainerComponent> | null =
		null;

	openProjectDialog(
		projectData: Project | undefined,
		newProject: boolean,
	): MatDialogRef<DialogProjectContainerComponent> {
		const dialogRef = this.dialog.open(DialogProjectContainerComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "90vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { projectData, newProject },
		});
		this.projectContainerDialogRef = dialogRef;
		return dialogRef;
	}

	getProjectContainerDialogRef() {
		return this.projectContainerDialogRef;
	}

	openBacklogDialog(
		backlogData: BacklogData | undefined,
		newBacklog: boolean,
	): MatDialogRef<DialogBacklogContainerComponent> {
		const dialogRef = this.dialog.open(DialogBacklogContainerComponent, {
			autoFocus: false,
			width: "850vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { backlogData, newBacklog },
		});
		this.backlogContainerDialogRef = dialogRef;
		return dialogRef;
	}

	getBacklogContainerDialogRef() {
		return this.backlogContainerDialogRef;
	}

	openWorkDialog(
		workData: WorkData | undefined,
		backlogId: number | undefined,
		newWork: boolean,
	): MatDialogRef<DialogWorkContainerComponent> {
		const dialogRef = this.dialog.open(DialogWorkContainerComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "850vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { workData, newWork, backlogId },
		});
		this.workContainerDialogRef = dialogRef;
		console.log("openWorkDialog", workData, backlogId, newWork);
		return dialogRef;
	}

	getWorkContainerDialogRef() {
		return this.workContainerDialogRef;
	}
	openUtilityDialog(
		message: string,
		type: "fail" | "success" | "confirmation",
	): MatDialogRef<DialogUtilityComponent> {
		const dialogRef = this.dialog.open(DialogUtilityComponent, {
			autoFocus: false,
			width: "60vw",
			height: "90vh",
			maxWidth: "90vw",
			maxHeight: "fit-content",
			panelClass: "custom-dialog-container",
			data: { message, type }, // Passes the request ID to the dialog.
		});

		// Returns the refrence to the dialog opened
		return dialogRef;
	}
}
