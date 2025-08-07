import { Component, inject, signal, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import { DialogWorkDetailComponent } from "../dialog-work-detail/dialog-work-detail.component";
import { DialogWorkInputComponent } from "../dialog-work-input/dialog-work-input.component";
import type { NameListItem } from "../../model/format.type";
import { MatIconModule } from "@angular/material/icon";
import { SelectorUserWorkComponent } from "../selector-user-work/selector-user-work.component";
import { MatButtonModule } from "@angular/material/button";
import { DataProcessingService } from "../../service/data-processing.service";
import { DialogUtilButtonRowComponent } from "../dialog-util-button-row/dialog-util-button-row.component";
import { DialogUtilTitleComponent } from "../dialog-util-title/dialog-util-title.component";

@Component({
	selector: "app-dialog-work-container",
	imports: [
		DialogWorkDetailComponent,
		DialogWorkInputComponent,
		SelectorUserWorkComponent,
		MatButtonModule,
		DialogUtilButtonRowComponent,
		DialogUtilTitleComponent,
	],
	templateUrl: "./dialog-work-container.component.html",
	styleUrl: "./dialog-work-container.component.css",
})
export class DialogWorkContainerComponent {
	dialogData = inject(MAT_DIALOG_DATA);
	currentPic = signal<NameListItem>({ name: "", id: 0 });
	editable = signal<boolean>(false);
	@ViewChild(SelectorUserWorkComponent)
	SelectorUserWorkComponent!: SelectorUserWorkComponent;
	@ViewChild(DialogWorkInputComponent)
	DialogWorkInputComponent!: DialogWorkInputComponent;

	ngOnInit() {}
	toggleEdit() {
		this.editable.set(!this.editable());
	}

	selectActivity(activity: NameListItem) {
		this.SelectorUserWorkComponent.initProjectUsers(activity.id);
	}

	selectorEmpty(empty: boolean) {
		this.DialogWorkInputComponent.changeState(empty);
	}

	triggerNewWorkSubmit() {
		this.DialogWorkInputComponent.newWorkCreate(
			this.SelectorUserWorkComponent.getArrayChanges().usersAdded,
		);
	}
	triggerEditWorkSubmit() {
		const changes = this.SelectorUserWorkComponent.getArrayChanges();
		this.DialogWorkInputComponent.workEdit(
			changes.usersRemoved,
			changes.usersAdded,
		);
		this.toggleEdit();
	}

	triggerDeleteWork() {}
}
