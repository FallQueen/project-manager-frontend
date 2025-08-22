import {
	Component,
	Input,
	type OnChanges,
	type SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: "app-pop-up-profile-info",
	standalone: true,
	imports: [CommonModule, MatIconModule, MatButtonModule],
	templateUrl: "./pop-up-profile-info.component.html",
	styleUrls: ["./pop-up-profile-info.component.css"],
})
export class PopUpProfileInfoComponent implements OnChanges {
	@Input() name!: string;
	@Input() email!: string;
	@Input() role!: string;
	@Input() bio!: string;

	// tambahan untuk kontrol auto-close
	@Input() expanded = true;
	@Input() visible = false;

	isOpen = false;

	ngOnChanges(changes: SimpleChanges) {
		// kalau sidebar collapse → auto tutup
		// biome-ignore lint/complexity/useLiteralKeys: <need quote>
		if (changes["expanded"] && !this.expanded) {
			this.isOpen = false;
		} else {
			this.isOpen = this.visible;
		}
	}
}
