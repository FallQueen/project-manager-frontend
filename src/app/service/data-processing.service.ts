import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import type {
	NewProjectInput,
	Project,
	User,
	NameListItem,
	NameListItemByRole,
	AlterProject,
	BacklogData,
	WorkData,
	AlterWork,
} from "../model/format.type";
import { firstValueFrom } from "rxjs";

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

	private trackerList!: NameListItem[];
	private activityList!: NameListItem[];
	private priorityList!: NameListItem[];
	private stateList!: NameListItem[];

	constructor() {
		this.getStartBundle();
	}
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

	setProject(projectId: number, projectName: string) {
		localStorage.setItem("projectId", projectId.toString());
		localStorage.setItem("projectName", projectName);
	}

	getprojectId(): number {
		return Number(this.returnIfNotNull(localStorage.getItem("projectId")));
	}
	getprojectName(): string {
		return this.returnIfNotNull(localStorage.getItem("projectName"));
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

	getStartBundle() {
		const url = `${this.host}/getStartBundle`;

		this.http
			.get<{
				trackerList: NameListItem[];
				activityList: NameListItem[];
				priorityList: NameListItem[];
				stateList: NameListItem[];
			}>(url)
			.subscribe((result) => {
				this.trackerList = result.trackerList;
				this.activityList = result.activityList;
				this.priorityList = result.priorityList;
				this.stateList = result.stateList;
			});
	}

	getTrackerList(): NameListItem[] {
		if (this.trackerList !== undefined) {
			return this.trackerList;
		}
		return [];
	}

	getActivityList(): NameListItem[] {
		if (this.activityList !== undefined) {
			return this.activityList;
		}

		return [];
	}

	getPriorityList(): NameListItem[] {
		if (this.priorityList !== undefined) {
			return this.priorityList;
		}
		return [];
	}

	getStateList(): NameListItem[] {
		if (this.stateList !== undefined) {
			return this.stateList;
		}
		return [];
	}

	getProjects() {
		const url = `${this.host}/getProjects`;
		return this.http.get<Project[]>(url);
	}

	postNewProject(newProject: NewProjectInput) {
		const url = `${this.host}/postNewProject`;
		return this.http.post(url, newProject);
	}

	putAlterProject(alterProject: AlterProject) {
		const url = `${this.host}/putAlterProject`;
		return this.http.put(url, alterProject);
	}

	getUsernames() {
		const url = `${this.host}/getUsernames`;
		return this.http.get<NameListItem[]>(url);
	}

	getProjectAssignedUsernames(projectId: number, roleId: number) {
		const url = `${this.host}/getProjectAssignedUsernames?projectId=${projectId}&roleId=${roleId}`;
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

	getProjectBacklogs(projectId: number) {
		const url = `${this.host}/getProjectBacklogs?projectId=${projectId}`;
		return this.http.get<BacklogData[]>(url);
	}

	getBacklogWorks(backlogId: number) {
		const url = `${this.host}/getBacklogWorks?backlogId=${backlogId}`;
		return this.http.get<WorkData[]>(url);
	}

	getWorkUserAssignment(workId: number) {
		const url = `${this.host}/getUserWorkAssignment?workId=${workId}`;
		return this.http.get<NameListItem[]>(url);
	}

	putAlterWork(alterProject: AlterWork) {
		const url = `${this.host}/putAlterUserWorkAssignment`;
		return this.http.put(url, alterProject);
	}

	getPeriodDonePercentage(startDate: Date, endDate: Date): number {
		const start = new Date(startDate).getTime();
		const end = new Date(endDate).getTime();
		const total = end - start;

		// Handle cases where the period is invalid or has ended/not started
		const percentage = (Date.now() - start) / total;
		if (percentage <= 0) {
			return 0;
		}

		return Math.floor(1000 * Math.min(percentage, 1)) / 10;
	}
}
