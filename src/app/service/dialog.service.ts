import { inject, Injectable } from "@angular/core";
import { MatDialog, type MatDialogRef } from "@angular/material/dialog";
import { DialogSubModuleContainerComponent } from "../component/dialog-sub-module-container/dialog-sub-module-container.component";
import { DialogModuleContainerComponent } from "../component/dialog-module-container/dialog-module-container.component";
import type {
	SubModuleData,
	Project,
	WorkData,
	ModuleData,
} from "../model/format.type";
import { DialogProjectContainerComponent } from "../component/dialog-project-container/dialog-project-container.component";
import { DialogWorkBugContainerComponent } from "../component/dialog-work-bug-container/dialog-work-bug-container.component";
import { DialogUtilityComponent } from "../component/dialog-utility/dialog-utility.component";
import { DataProcessingService } from "./data-processing.service";
import { map, type Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class DialogService {
	private dataService = inject(DataProcessingService);
	// Injects the Angular Material Dialog service for opening dialogs.
	private dialog = inject(MatDialog);

	// Stores references to the currently opened dialogs for each dialog type.
	private projectContainerDialogRef: MatDialogRef<DialogProjectContainerComponent> | null =
		null;
	private subModuleContainerDialogRef: MatDialogRef<DialogSubModuleContainerComponent> | null =
		null;
	private moduleContainerDialogRef: MatDialogRef<DialogModuleContainerComponent> | null =
		null;
	private workContainerDialogRef: MatDialogRef<DialogWorkBugContainerComponent> | null =
		null;

	// Opens the Project dialog with the provided project data.
	// @param projectData The project data to be passed to the dialog.
	// @param newProject Indicates if the dialog is for creating a new project.
	// @returns Reference to the opened Project dialog.
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

	// Returns the reference to the currently opened Project dialog, if any.

	getProjectContainerDialogRef() {
		return this.projectContainerDialogRef;
	}

	// Opens the subModule dialog with the provided subModule data.
	// @param subModuleData The subModule data to be passed to the dialog.
	// @param newsubModule Indicates if the dialog is for creating a new subModule item.
	// @returns Reference to the opened subModule dialog.
	openSubModuleDialog(
		subModuleData: SubModuleData | undefined,
		newSubModule: boolean,
	): MatDialogRef<DialogSubModuleContainerComponent> {
		const dialogRef = this.dialog.open(DialogSubModuleContainerComponent, {
			autoFocus: false,
			width: "850vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { subModuleData, newSubModule },
		});
		this.subModuleContainerDialogRef = dialogRef;
		return dialogRef;
	}

	// Returns the reference to the currently opened subModule dialog, if any.
	getSubModuleContainerDialogRef() {
		return this.subModuleContainerDialogRef;
	}

	// Opens the module dialog with the provided module data.
	// @param moduleData The module data to be passed to the dialog.
	// @param newModule Indicates if the dialog is for creating a new module.
	// @returns Reference to the opened module dialog.
	openModuleDialog(
		moduleData: ModuleData | undefined,
		newModule: boolean,
	): MatDialogRef<DialogModuleContainerComponent> {
		const dialogRef = this.dialog.open(DialogModuleContainerComponent, {
			autoFocus: false,
			width: "850vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { moduleData, newModule },
		});
		this.moduleContainerDialogRef = dialogRef;
		return dialogRef;
	}

	// Returns the reference to the currently opened module dialog, if any.
	getModuleContainerDialogRef() {
		return this.moduleContainerDialogRef;
	}

	// Opens the Work dialog with the provided work data.
	// @param workData The work data to be passed to the dialog.
	// @param subModuleId The ID of the associated subModule item.
	// @param newWork Indicates if the dialog is for creating a new work item.
	// @returns Reference to the opened Work dialog.
	openWorkDialog(
		workData: WorkData | undefined,
		subModuleId: number | undefined,
		newWork: boolean,
	): MatDialogRef<DialogWorkBugContainerComponent> {
		const dialogRef = this.dialog.open(DialogWorkBugContainerComponent, {
			autoFocus: false, // Prevents the dialog from automatically focusing an element.
			width: "850vw",
			height: "fit-content",
			maxWidth: "90vw",
			maxHeight: "90vh",
			panelClass: "custom-dialog-container",
			data: { workData, newWork, subModuleId },
		});
		this.workContainerDialogRef = dialogRef;
		console.log("openWorkDialog", workData, subModuleId, newWork);
		return dialogRef;
	}

	openDialogForWorkById(
		workId: number,
	): Observable<MatDialogRef<DialogWorkBugContainerComponent>> {
		return this.dataService.getWorkDetails(workId).pipe(
			// Use map to transform the workData into a dialog reference
			map((workData) => this.openWorkDialog(workData, undefined, false)),
		);
	}

	openDialogForBugById(
		bugId: number,
	): Observable<MatDialogRef<DialogWorkBugContainerComponent>> {
		return this.dataService.getBugDetails(bugId).pipe(
			// Use map to transform the bugData into a dialog reference
			map((bugData) => this.openWorkDialog(bugData, undefined, false)),
		);
	}

	// Returns the reference to the currently opened Work dialog, if any.
	getWorkContainerDialogRef() {
		return this.workContainerDialogRef;
	}

	// Opens a utility dialog for displaying messages such as errors, successes, or confirmations.
	// @param message The message to display in the dialog.
	// @param type The type of message ('fail', 'success', or 'confirmation').
	// @returns Reference to the opened Utility dialog.
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
			data: { message, type }, // Passes the message and type to the dialog.
		});

		// Returns the reference to the opened dialog.
		return dialogRef;
	}
}
