import {
	Component,
	computed,
	EventEmitter,
	inject,
	output,
	Output,
	type Signal,
	signal,
} from "@angular/core";
import type { NameListItem } from "../../model/format.type";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SearchBarService } from "../../service/search-bar.service";
import { DataProcessingService } from "../../service/data-processing.service";
@Component({
	selector: "app-search-bar",
	imports: [
		ReactiveFormsModule,
		MatInputModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
	],
	templateUrl: "./search-bar.component.html",
	styleUrl: "./search-bar.component.css",
	providers: [SearchBarService],
})
export class SearchBarComponent {
	searchBarService = inject(SearchBarService);
	dataService = inject(DataProcessingService);
	// Input: The full list of userNames to search from
	projectNames = signal<NameListItem[]>([]);

	// Output: Emits the selected username object
	@Output() userNameSelected = new EventEmitter<number>();

	// The filtering logic
	ngOnInit() {
		this.dataService.getUsernames().subscribe((result) => {
			this.searchBarService.nameList.set(result);
		});
	}
	// When an option is selected from the list
	onSelection(selectedName: NameListItem) {
		this.userNameSelected.emit(selectedName.id);
	}
}
