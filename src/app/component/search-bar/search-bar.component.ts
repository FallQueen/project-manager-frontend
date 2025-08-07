import {
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
	signal,
} from "@angular/core";
import type { NameListItem } from "../../model/format.type";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SearchService } from "../../service/search.service";
import { DataProcessingService } from "../../service/data-processing.service";
@Component({
	selector: "app-search-bar",
	imports: [
		MatInputModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		FormsModule,
	],
	templateUrl: "./search-bar.component.html",
	styleUrl: "./search-bar.component.css",
	providers: [SearchService],
})
export class SearchBarComponent {
	searchBarService = inject(SearchService);
	dataService = inject(DataProcessingService);
	// Input: The full list of userNames to search from
	projectNames = signal<NameListItem[]>([]);

	// Output: Emits the selected username object
	@Output() nameItemSelected = new EventEmitter<NameListItem>();
	@Output() clicked = new EventEmitter<void>();
	@Input() fieldLabel = "";
	@Input() nameList = signal<NameListItem[]>([]);
	@Input() textInput = "";

	// The filtering logic
	ngOnInit() {
		this.searchBarService.nameList = this.nameList;
	}

	ngOnChanges() {
		const input = this.textInput;
		this.searchBarService.nameInput.set(input);
	}
	// When an option is selected from the list
	onSelection(selectedName: NameListItem) {
		this.nameItemSelected.emit(selectedName);
	}
}
