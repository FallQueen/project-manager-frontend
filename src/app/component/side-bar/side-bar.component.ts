import { Component, inject, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { DataProcessingService } from "../../service/data-processing.service";
import { LoginService } from "../../service/login.service";
import { FormsModule } from "@angular/forms";
import type { NameListItem, workNameListItem } from "../../model/format.type";
import { CommonModule } from "@angular/common";
import { PopUpProfileInfoComponent } from "../pop-up-profile-info/pop-up-profile-info.component";

@Component({
	selector: "app-side-bar",
	standalone: true,
	imports: [
		RouterLink,
		MatIconModule,
		RouterLinkActive,
		FormsModule,
		PopUpProfileInfoComponent,
		CommonModule,
	],
	templateUrl: "./side-bar.component.html",
	styleUrls: ["./side-bar.component.css"],
})
export class SideBarComponent {
	dataService = inject(DataProcessingService);
	loginService = inject(LoginService);

	username = signal<string>(this.dataService.usernameSignal());
	searchInput = signal<string>("");
	projectList = signal<NameListItem[]>([]);
	workList = signal<workNameListItem[]>([]);
	isExpanded = signal<boolean>(true);
	isProfileVisible = signal<boolean>(false);

	ngOnInit() {
		this.dataService.getProjectAndWorkNames().subscribe((data) => {
			this.projectList.set(data.projectList);
			this.workList.set(data.workList);
		});
	}

	ngAfterViewInit() {
		window.addEventListener("mousedown", this.handleClickOutside);
	}

	ngOnDestroy() {
		window.removeEventListener("mousedown", this.handleClickOutside);
	}

	toggleSidebar(): void {
		this.isExpanded.set(!this.isExpanded());

		if (!this.isExpanded()) {
			this.isProfileVisible.set(false);
		}
	}

	toggleProfile(): void {
		if (!this.isExpanded()) return;
		this.isProfileVisible.set(!this.isProfileVisible());
	}

	// 👇 tambahan buat auto-close kalau klik di luar profile / dropdown
	handleClickOutside = (event: MouseEvent) => {
		const profileTrigger = document.querySelector(".profile");
		const dropdown = document.querySelector("app-pop-up-profile-info");

		if (
			profileTrigger &&
			dropdown &&
			!profileTrigger.contains(event.target as Node) &&
			!dropdown.contains(event.target as Node)
		) {
			this.isProfileVisible.set(false);
		}
	};
	expandSidebar(): void {
		this.isExpanded.set(true);
	}

	collapseSidebar(): void {
		this.isExpanded.set(false);
		this.isProfileVisible.set(false); // 👈 auto tutup dropdown juga
	}
}
