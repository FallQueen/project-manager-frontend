import { HttpClient } from "@angular/common/http";
import { inject, Injectable, type Signal } from "@angular/core";
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
	NewWork,
	NewBacklog,
	AlterBacklog,
	userProjectRoles,
	UserTodoList,
} from "../model/format.type";
import { firstValueFrom } from "rxjs";
import { signal } from "@angular/core";

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

	trackerList = signal<NameListItem[]>([]);
	activityList = signal<NameListItem[]>([]);
	priorityList = signal<NameListItem[]>([]);
	stateList = signal<NameListItem[]>([]);

	constructor() {
		this.getStartBundle();
	}
	// Stores user information in localStorage after a successful login.
	storeUserInfo(u: User) {
		localStorage.setItem("userId", u.userId.toString());
		localStorage.setItem("username", u.username);
		localStorage.setItem("userEmail", u.email);
		localStorage.setItem("webRole", u.webRole.toString());
		localStorage.setItem("projectRoles", JSON.stringify(u.projectRoles || []));
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
	getwebRole(): string {
		return this.returnIfNotNull(localStorage.getItem("webRole"));
	}

	getProjectRoles(): userProjectRoles[] {
		const projectRoles = localStorage.getItem("projectRoles");
		return projectRoles ? JSON.parse(projectRoles) : [];
	}

	checkUserProjectRole(projectId: number): number[] {
		const projectRoles = this.getProjectRoles();
		const role = projectRoles.find((pr) => pr.projectId === projectId);
		if (role) {
			return role.roles;
		}
		return [];
	}

	resetUserData() {
		localStorage.removeItem("userId");
		localStorage.removeItem("username");
		localStorage.removeItem("userEmail");
		localStorage.removeItem("webRole");
		localStorage.removeItem("projectRoles");
	}

	setProject(projectId: number, projectName: string) {
		localStorage.setItem("projectId", projectId.toString());
		localStorage.setItem("projectName", projectName);
	}

	getProjectId(): number {
		return Number(this.returnIfNotNull(localStorage.getItem("projectId")));
	}
	getprojectName(): string {
		return this.returnIfNotNull(localStorage.getItem("projectName"));
	}

	clearUserData() {
		localStorage.setItem("userId", "0");
		localStorage.setItem("username", "");
		localStorage.setItem("userEmail", "");
		localStorage.setItem("webRole", "");
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
				this.trackerList.set(result.trackerList);
				this.activityList.set(result.activityList);
				this.priorityList.set(result.priorityList);
				this.stateList.set(result.stateList);
			});
	}

	getTrackerList(): Signal<NameListItem[]> {
		return this.trackerList;
	}

	getActivityList(): Signal<NameListItem[]> {
		return this.activityList;
	}

	getPriorityList(): Signal<NameListItem[]> {
		return this.priorityList;
	}

	getStateList(): Signal<NameListItem[]> {
		return this.stateList;
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

	getProjectAssignedUsernames(projectId: number, roleId: number | null = null) {
		let url = "";
		if (roleId === null) {
			url = `${this.host}/getProjectAssignedUsernames?projectId=${projectId}`;
		} else {
			url = `${this.host}/getProjectAssignedUsernames?projectId=${projectId}&roleId=${roleId}`;
		}
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

	postNewBacklog(newBacklog: NewBacklog) {
		const url = `${this.host}/postNewBacklog`;
		return this.http.post(url, newBacklog);
	}

	getBacklogWorks(backlogId: number) {
		const url = `${this.host}/getBacklogWorks?backlogId=${backlogId}`;
		return this.http.get<WorkData[]>(url);
	}

	putAlterBacklog(alterBacklog: AlterBacklog) {
		const url = `${this.host}/putAlterBacklog`;
		return this.http.put(url, alterBacklog);
	}

	postNewWork(newWork: NewWork) {
		const url = `${this.host}/postNewWork`;
		return this.http.post(url, newWork);
	}

	putAlterWork(alterWork: AlterWork) {
		const url = `${this.host}/putAlterWork`;
		return this.http.put(url, alterWork);
	}

	getWorkUserAssignment(workId: number) {
		const url = `${this.host}/getUserWorkAssignment?workId=${workId}`;
		return this.http.get<NameListItem[]>(url);
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

	getUserTodoList() {
		const url = `${this.host}/getUserTodoList?userId=${this.getUserId()}`;
		return this.http.get<UserTodoList[]>(url);
	}

	displayName(nameItem: NameListItem): string {
		return nameItem?.name ? nameItem.name : "";
	}

	formatClassName(name: string): string {
		return name.toUpperCase().replace(/\s+/g, "-");
	}
}
