import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import type { User } from "../model/format.type";

@Injectable({
	providedIn: "root",
})
export class DataProcessingService {
	// Inject HttpClient to enable api calling.
	http = inject(HttpClient);
	// Inject Router to handle routing.
	router = inject(Router);
	// The base URL for the backend API.
	// host = "https://state-management-api.vercel.app/api";
	host = "http://localhost:9090/api";

	// Stores user information in localStorage after a successful login.
	storeUserInfo(u: User) {
		localStorage.setItem("userId", u.userId);
		localStorage.setItem("userName", u.userName);
		localStorage.setItem("userEmail", u.email);
		localStorage.setItem("userRole", u.roleId);
	}

	// Retrieves the current user's ID from localStorage.
	getUserId(): string {
		return this.returnIfNotNull(localStorage.getItem("userId"));
	}

	// Retrieves the current user's name from localStorage.
	getUserName(): string {
		return this.returnIfNotNull(localStorage.getItem("userName"));
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
		localStorage.setItem("userName", "");
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
}
