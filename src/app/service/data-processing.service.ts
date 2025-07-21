import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import type {
	NewProjectInput,
	Project,
	User,
	NameListItem,
	NameListItemByRole,
} from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class DataProcessingService {
	// Inject HttpClient to enable api calling.
	private http = inject(HttpClient);
	// Inject Router to handle routing.
	private router = inject(Router);
	// The base URL for the backend API.
	// host = "https://state-management-api.vercel.app/api";
	private host = "http://localhost:9090/api";

	// Stores user information in localStorage after a successful login.
	storeUserInfo(u: User) {
		localStorage.setItem("userId", u.userId);
		localStorage.setItem("username", u.username);
		localStorage.setItem("userEmail", u.email);
		localStorage.setItem("userRole", u.roleId);
	}

	// Retrieves the current user's ID from localStorage.
	getUserId(): string {
		return this.returnIfNotNull(localStorage.getItem("userId"));
	}

	// Retrieves the current user's name from localStorage.
	getUserName(): string {
		return this.returnIfNotNull(localStorage.getItem("username"));
	}

	// Retrieves the current user's email from localStorage.
	getUserEmail(): string {
		return this.returnIfNotNull(localStorage.getItem("userEmail"));
	}

	// Retrieves the current user's role ID from localStorage.
	getUserRole(): string {
		return this.returnIfNotNull(localStorage.getItem("userRole"));
	}

	clearUserData() {
		localStorage.setItem("userId", "0");
		localStorage.setItem("username", "");
		localStorage.setItem("userEmail", "");
		localStorage.setItem("userRole", "");
	}

	// A private utility to handle null values from localStorage, returning an empty string instead.
	private returnIfNotNull(input: string | null): string {
		if (input === null || input === undefined) {
			return "";
		}
		return input;
	}

	getProjects() {
		const url = `${this.host}/getProjects`;
		return this.http.get<Project[]>(url);
	}

	postNewProject(newProject: NewProjectInput) {
		const url = `${this.host}/postNewProject`;
		return this.http.post(url, newProject);
	}

	getUsernames() {
		const url = `${this.host}/getUsernames`;
		return this.http.get<NameListItem[]>(url);
	}

	getProjectNames() {
		const url = `${this.host}/getProjectNames`;
		return this.http.get<NameListItem[]>(url);
	}

	getTaskNames() {
		const url = `${this.host}/getTaskNames`;
		return this.http.get<NameListItem[]>(url);
	}

	getUserProjectRoles(projectId: number) {
		const url = `${this.host}/getUserProjectRoles?projectId=${projectId}`;
		return this.http.get<NameListItemByRole[]>(url);
	}
}
