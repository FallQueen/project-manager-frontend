import {
	Component,
	computed,
	effect,
	EventEmitter,
	inject,
	Input,
	Output,
	type Signal,
	signal,
	ViewChild,
} from "@angular/core";
import type { NameListItem, workNameListItem } from "../../model/format.type";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import {
	MatAutocompleteModule,
	MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SearchService } from "../../service/search.service";
import { DataProcessingService } from "../../service/data-processing.service";

@Component({
	selector: "app-search-bar-proj-and-work",
	imports: [
		MatInputModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		FormsModule,
	],
	templateUrl: "./search-bar-proj-and-work.component.html",
	styleUrl: "./search-bar-proj-and-work.component.css",
	providers: [SearchService],
})
export class SearchBarProjAndWorkComponent {
	searchBarService = inject(SearchService);

	dataService = inject(DataProcessingService);
	// Input: The full list of userNames to search from
	projectNames = signal<NameListItem[]>([]);

	// Output: Emits the selected username object
	@Output() nameItemSelected = new EventEmitter<NameListItem>();
	@Input() projectNameList = signal<NameListItem[]>([]);
	@Input() workNameList = signal<workNameListItem[]>([]);
	@Input() textInput = signal("");
	@ViewChild("autoCompleteTrigger", { read: MatAutocompleteTrigger })
	autoCompleteTrigger!: MatAutocompleteTrigger;

	constructor() {
		effect(() => {
			const input = this.textInput();
			console.log(input);
			if (this.autoCompleteTrigger) {
				if (this.textInput() !== "") {
					this.autoCompleteTrigger.openPanel();
				} else {
					this.autoCompleteTrigger.closePanel();
				}
			}
		});
	}

	filteredProjectNames: Signal<NameListItem[]> = computed(() => {
		return this.searchBarService
			.filter(this.textInput(), this.projectNameList())
			.slice(0, 3);
	});

	filteredWorkNames: Signal<workNameListItem[]> = computed(() => {
		const workList = this.workNameList();

		if (!this.isWorkNameList(workList)) {
			return [];
		}
		// Type assertion is safe here due to the guard above
		return this.searchBarService
			.filter(this.textInput(), workList as workNameListItem[])
			.slice(0, 3) as workNameListItem[];
	});

	selectProject(projectId: number) {
		this.dataService.changeProject(projectId);
	}

	// The filtering logic
	ngOnInit() {
		this.searchBarService.enableIdFilter();
	}

	// When an option is selected from the list
	onSelection(selectedName: NameListItem) {
		this.nameItemSelected.emit(selectedName);
	}

	isWorkNameList(list: unknown): boolean {
		return Array.isArray(list) && list.length > 0 && "projectId" in list[0];
	}
}
