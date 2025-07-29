import { Component, inject, signal, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import { DialogWorkDetailComponent } from "../dialog-work-detail/dialog-work-detail.component";
import { DialogWorkInputComponent } from "../dialog-work-input/dialog-work-input.component";
import type { NameListItem } from "../../model/format.type";
import { MatIconModule } from "@angular/material/icon";
import { SelectorUserWorkComponent } from "../selector-user-work/selector-user-work.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-dialog-work-container",
	imports: [
		MatDialogClose,
		DialogWorkDetailComponent,
		DialogWorkInputComponent,
		SelectorUserWorkComponent,
		MatIconModule,
		MatButtonModule,
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

	toggleEdit() {
		this.editable.set(!this.editable());
	}

	selectActivity(activity: NameListItem) {
		this.SelectorUserWorkComponent.initProjectUsers(activity.id);
	}
	triggerNewWorkSubmit() {}
	triggerEditWorkSubmit() {}
}
