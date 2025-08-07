import {
	Component,
	EventEmitter,
	inject,
	Input,
	output,
	Output,
} from "@angular/core";
import { DataProcessingService } from "../../service/data-processing.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: "app-dialog-util-title",
	imports: [MatIconModule],
	templateUrl: "./dialog-util-title.component.html",
	styleUrl: "./dialog-util-title.component.css",
})
export class DialogUtilTitleComponent {
	dataService = inject(DataProcessingService);
	@Input() new = true;
	@Input() editable = false;
	@Input() title = "";
	@Input() titleNew = "";
	@Output() edit = new EventEmitter<void>();
	@Output() delete = new EventEmitter<void>();
}
