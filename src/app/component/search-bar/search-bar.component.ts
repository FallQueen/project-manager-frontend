import {
	Component,
	computed,
	EventEmitter,
	inject,
	Output,
	type Signal,
	signal,
} from "@angular/core";
import type { Username } from "../../model/format.type";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SearchBarService } from "../../service/search-bar.service";
@Component({
	selector: "app-search-bar",
	imports: [
		ReactiveFormsModule,
		MatInputModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		FormsModule,
	],
	templateUrl: "./search-bar.component.html",
	styleUrl: "./search-bar.component.css",
})
export class SearchBarComponent {
	searchBarService = inject(SearchBarService);
	// Input: The full list of userNames to search from
	userNames = signal<Username[]>([
		{ userId: 1, username: "alice" },
		{ userId: 2, username: "garyo" },
		{ userId: 1, username: "alice" },
		{ userId: 2, username: "garyo" },
		{ userId: 1, username: "alice" },
		{ userId: 2, username: "garyo" },
		{ userId: 1, username: "alice" },
		{ userId: 2, username: "garyo" },
	]);

	// Output: Emits the selected username object
	@Output() userNameSelected = new EventEmitter<Username>();

	userNameInput = signal("");
	filteredUserNames: Signal<Username[]> = computed(() => {
		// Reads the current time from the shared timer service.
		const name = this.userNameInput();
		const readOnly = this.searchBarService.usernames();
		console.log("compute filter");
		return this.filter(name);
	});

	ngOnInit() {}

	// The filtering logic
	private filter(value: string): Username[] {
		const filterValue = value.toLowerCase();
		const tempUserNames = this.searchBarService.usernames();
		return tempUserNames.filter((username) =>
			username.username.toLowerCase().includes(filterValue),
		);
	}

	// When an option is selected from the list
	onSelection(selectedUserName: Username): void {
		this.userNameSelected.emit(selectedUserName);
	}
}
