import {
	Component,
	effect,
	EventEmitter,
	inject,
	Injector,
	Input,
	Output,
} from "@angular/core";
import { SearchBarService } from "../../service/search-bar.service";
import type { NameListItem } from "../../model/format.type";

@Component({
	selector: "app-user-search-base",
	imports: [],
	templateUrl: "./user-search-base.component.html",
	styleUrl: "./user-search-base.component.css",
})
export class UserSearchBaseComponent {
	searchBarService = inject(SearchBarService);
	injector = inject(Injector);
	@Input() nameList: NameListItem[] = [];
	@Input() nameInput = "";
	@Output() filteredNameList = new EventEmitter<NameListItem[]>();

	ngOnInit() {
		effect(
			() => {
				const nameList = this.nameList;
				const filteredList = this.searchBarService.filter(
					this.nameInput,
					nameList,
				);
				this.filteredNameList.emit(filteredList);
			},
			{ injector: this.injector },
		);
	}
}
