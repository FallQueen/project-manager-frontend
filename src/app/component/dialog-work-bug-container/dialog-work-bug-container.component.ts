import { Component, inject, signal, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import { DialogWorkBugDetailComponent } from "../dialog-work-bug-detail/dialog-work-bug-detail.component";
import { DialogWorkBugInputComponent } from "../dialog-work-bug-input/dialog-work-bug-input.component";
import type { NameListItem } from "../../model/format.type";
import { MatIconModule } from "@angular/material/icon";
import { SelectorUserWorkComponent } from "../selector-user-work/selector-user-work.component";
import { MatButtonModule } from "@angular/material/button";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogUtilButtonRowComponent } from "../dialog-util-button-row/dialog-util-button-row.component";
import { DialogUtilTitleComponent } from "../dialog-util-title/dialog-util-title.component";
import { DialogService } from "../../service/dialog.service";

@Component({
	selector: "app-dialog-work-bug-container",
	imports: [
		DialogWorkBugDetailComponent,
		DialogWorkBugInputComponent,
		SelectorUserWorkComponent,
		MatButtonModule,
		DialogUtilButtonRowComponent,
		DialogUtilTitleComponent,
	],
	templateUrl: "./dialog-work-bug-container.component.html",
	styleUrl: "./dialog-work-bug-container.component.css",
})
export class DialogWorkBugContainerComponent {
	dataService = inject(DataProcessingService);
	dialogService = inject(DialogService);
	dialogData = inject(MAT_DIALOG_DATA);
	currentPic = signal<NameListItem>({ name: "", id: 0 });
	editable = signal<boolean>(false);
	haveBeenEdited = signal<boolean>(false);
	@ViewChild(SelectorUserWorkComponent)
	SelectorUserWorkComponent!: SelectorUserWorkComponent;
	@ViewChild(DialogWorkBugInputComponent)
	DialogWorkBugInputComponent!: DialogWorkBugInputComponent;
	isBug = this.dataService.isBugData(this.dialogData.workData);
	dialogBaseTitle = signal<string>(this.isBug ? "BUG" : "WORK");

	ngOnInit() {}
	toggleEdit() {
		this.editable.set(!this.editable());
	}

	selectActivity(activity: NameListItem) {
		this.SelectorUserWorkComponent.initProjectUsers(activity.id);
	}

	selectorEmpty(empty: boolean) {
		this.DialogWorkBugInputComponent.changeState(empty);
	}

	triggerNewWorkSubmit() {
		this.DialogWorkBugInputComponent.newWorkOrBugCreate(
			this.SelectorUserWorkComponent.getArrayChanges().usersAdded,
		);
	}
	triggerEditWorkSubmit() {
		const changes = this.SelectorUserWorkComponent.getArrayChanges();
		this.DialogWorkBugInputComponent.editWorkOrBug(
			changes.usersRemoved,
			changes.usersAdded,
		);
		this.toggleEdit();
	}

	triggerDeleteWork() {
		this.dataService
			.dropWork(this.dialogData?.workData?.workId)
			.subscribe(() => {
				this.dialogService
					.getWorkContainerDialogRef()
					?.close({ drop: this.dialogData?.workData?.workId });
			});
	}
}
