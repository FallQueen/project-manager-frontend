import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable } from "@angular/core";
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
	ProjectBugList,
	BugData,
} from "../model/format.type";

import { signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class DataProcessingService {
	// Injects Angular's HttpClient for making HTTP requests to the backend API.
	private http = inject(HttpClient);

	// Injects Angular's Router for navigation and URL handling.
	private router = inject(Router);

	// The base URL for the backend API.
	// host = "https://state-management-api.vercel.app/api";
	private host = "http://localhost:9090/api";

	// Computes the current user's roles for the selected project.
	private currentProjectRoles = computed(() => {
		const projectId = this.projectIdSignal();
		const projectRoles = this.projectRolesSignal();
		return this.getUserProjectRole(projectId);
	});

	// Determines if the user is a webmaster or a manager in the current project.
	public readonly isWebMasterOrManager = computed(() => {
		const isWebRole = this.isWebMaster();
		const currentProjectRoles = this.currentProjectRoles();
		return isWebRole || this.isRole("manager");
	});

	// Checks if the user has webmaster privileges.
	public readonly isWebMaster = computed(() => {
		const webRole = this.webRoleSignal();
		return webRole === 1;
	});

	// Signals for storing and reacting to user and project state.
	public readonly projectIdSignal = signal(
		Number(localStorage.getItem("projectId")) || 0,
	);
	public readonly projectnameSignal = signal(
		localStorage.getItem("projectName") || "",
	);
	public readonly userIdSignal = signal(
		Number(localStorage.getItem("userId")) || 0,
	);
	public readonly usernameSignal = signal(
		localStorage.getItem("username") || "",
	);
	public readonly userEmailSignal = signal(
		localStorage.getItem("userEmail") || "",
	);
	public readonly webRoleSignal = signal(
		Number(localStorage.getItem("webRole") || 0),
	);
	private readonly projectRolesSignal = signal<userProjectRoles[]>(
		JSON.parse(localStorage.getItem("projectRoles") || "[]"),
	);

	// Signals for storing lists used throughout the application.
	public readonly trackerList = signal<NameListItem[]>([]);
	public readonly activityList = signal<NameListItem[]>([]);
	public readonly priorityList = signal<NameListItem[]>([]);
	public readonly stateList = signal<NameListItem[]>([]);

	// Stores user information in localStorage and updates signals after a successful login.
	// @param u The user object containing user details.
	storeUserInfo(u: User) {
		localStorage.setItem("userId", u.userId.toString());
		localStorage.setItem("username", u.username);
		localStorage.setItem("userEmail", u.email);
		localStorage.setItem("webRole", u.webRole.toString());
		localStorage.setItem("projectRoles", JSON.stringify(u.projectRoles || []));
		this.userIdSignal.set(u.userId);
		this.usernameSignal.set(u.username);
		this.userEmailSignal.set(u.email);
		this.webRoleSignal.set(u.webRole);
		this.projectRolesSignal.set(u.projectRoles || []);
	}

	// Checks if the current user has a specific role in the selected project.
	// @param role The role to check ('manager', 'developer', 'tester', 'designer').
	// @returns True if the user has the specified role, false otherwise.
	isRole(role: "manager" | "developer" | "tester" | "designer"): boolean {
		let roleId: number;
		switch (role) {
			case "manager":
				roleId = 1;
				break;
			case "developer":
				roleId = 2;
				break;
			case "tester":
				roleId = 3;
				break;
			case "designer":
				roleId = 4;
				break;
			default:
				throw new Error("Invalid role");
		}
		const projectRoles = this.currentProjectRoles();
		return projectRoles.includes(roleId);
	}

	// Clears all user and project data from localStorage and resets signals.
	resetUserData() {
		localStorage.removeItem("userId");
		localStorage.removeItem("username");
		localStorage.removeItem("userEmail");
		localStorage.removeItem("webRole");
		localStorage.removeItem("projectRoles");
		localStorage.removeItem("projectId");
		localStorage.removeItem("projectName");
		this.userIdSignal.set(0);
		this.usernameSignal.set("");
		this.userEmailSignal.set("");
		this.webRoleSignal.set(0);
		this.projectRolesSignal.set([]);
		this.projectIdSignal.set(0);
		this.projectnameSignal.set("");
		console.log("User data reset.");
	}

	// Retrieves the user's roles for a specific project.
	// @param projectId The ID of the project.
	// @returns An array of role IDs the user has in the project.
	getUserProjectRole(projectId: number): number[] {
		const projectRoles = this.projectRolesSignal();
		const role = projectRoles.find((pr) => pr.projectId === projectId);
		if (role) {
			return role.projectRoles;
		}
		return [];
	}

	// Changes the current project context, updates localStorage and navigates to the backlog page.
	// @param projectId The ID of the new project.
	// @param projectName The name of the new project.
	changeProject(projectId: number, projectName: string) {
		const roles = this.getUserProjectRole(projectId);
		console.log("web master:", this.isWebMaster());
		if (roles.length === 0 && !this.isWebMaster()) {
			alert("You have no roles in this project.");
			return;
		}
		localStorage.setItem("projectId", projectId.toString());
		this.projectIdSignal.set(projectId);
		localStorage.setItem("projectName", projectName);
		this.projectnameSignal.set(projectName);
		this.router.navigate(["/home", { outlets: { home: "backlog" } }]);
	}

	// Fetches and sets initial lists (trackers, activities, priorities, states) from the backend.
	getandSetStartBundle() {
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

	// Checks if the current route matches the specified page.
	// @param page The page to check ('project', 'dashboard', 'backlog', 'bug').
	// @returns True if the current route matches the page, false otherwise.
	isPage(page: "project" | "dashboard" | "backlog" | "bug"): boolean {
		const currentUrl = this.router.url;
		return currentUrl.includes(`(home:${page})`);
	}

	// Retrieves all projects from the backend.
	// @returns An Observable of the list of all projects.
	getAllProjects() {
		const url = `${this.host}/getAllProjects`;
		return this.http.get<Project[]>(url);
	}

	// Retrieves projects assigned to the current user.
	// @returns An Observable of the user's projects.
	getUserProjects() {
		const url = `${this.host}/getUserProjects?userId=${this.userIdSignal()}`;
		return this.http.get<Project[]>(url);
	}

	// Creates a new project.
	// @param newProject The new project data.
	// @returns An Observable of the server response.
	postNewProject(newProject: NewProjectInput) {
		console.log("Creating new project with data:", newProject);
		const url = `${this.host}/postNewProject`;
		return this.http.post(url, newProject);
	}

	// Updates an existing project.
	// @param alterProject The altered project data.
	// @returns An Observable of the server response.
	putAlterProject(alterProject: AlterProject) {
		const url = `${this.host}/putAlterProject`;
		return this.http.put(url, alterProject);
	}

	// Deletes a project by its ID.
	// @param projectId The ID of the project to delete.
	// @returns An Observable of the server response.
	dropProject(projectId: number) {
		const url = `${this.host}/dropProject?projectId=${projectId}`;
		return this.http.delete(url);
	}

	// Retrieves all usernames from the backend.
	// @returns An Observable of username list items.
	getUsernames() {
		const url = `${this.host}/getUsernames`;
		return this.http.get<NameListItem[]>(url);
	}

	// Retrieves usernames assigned to a project, optionally filtered by role.
	// @param projectId The project ID.
	// @param roleId Optional role ID to filter by.
	// @returns An Observable of username list items
	getProjectAssignedUsernames(projectId: number, roleId: number | null = null) {
		let url = "";
		if (roleId === null) {
			url = `${this.host}/getProjectAssignedUsernames?projectId=${projectId}`;
		} else {
			url = `${this.host}/getProjectAssignedUsernames?projectId=${projectId}&roleId=${roleId}`;
		}
		return this.http.get<NameListItem[]>(url);
	}

	// Retrieves all project names.
	// @returns An Observable of project name list items.
	getProjectNames() {
		const url = `${this.host}/getProjectNames`;
		return this.http.get<NameListItem[]>(url);
	}

	// Retrieves all task names.
	// @returns An Observable of task name list items.
	getTaskNames() {
		const url = `${this.host}/getTaskNames`;
		return this.http.get<NameListItem[]>(url);
	}

	// Retrieves user roles for a specific project.
	// @param projectId The project ID.
	// @returns An Observable of user roles by project.
	getUserProjectRoles(projectId: number) {
		const url = `${this.host}/getUserProjectRoles?projectId=${projectId}`;
		return this.http.get<NameListItemByRole[]>(url);
	}

	// Retrieves all backlogs for a project.
	// @param projectId The project ID.
	// @returns An Observable of backlog data.
	getProjectBacklogs(projectId: number) {
		const url = `${this.host}/getProjectBacklogs?projectId=${projectId}`;
		return this.http.get<BacklogData[]>(url);
	}

	// Creates a new backlog item.
	// @param newBacklog The new backlog data.
	// @returns An Observable of the server response.
	postNewBacklog(newBacklog: NewBacklog) {
		const url = `${this.host}/postNewBacklog`;
		return this.http.post(url, newBacklog);
	}

	// Deletes a backlog item by its ID.
	// @param backlogId The ID of the backlog item.
	// @returns An Observable of the server response.
	dropBacklog(backlogId: number) {
		const url = `${this.host}/dropBacklog?backlogId=${backlogId}`;
		return this.http.delete(url);
	}

	// Retrieves all works associated with a backlog item.
	// @param backlogId The backlog ID.
	// @returns An Observable of work data.
	getBacklogWorks(backlogId: number) {
		const url = `${this.host}/getBacklogWorks?backlogId=${backlogId}`;
		return this.http.get<WorkData[]>(url);
	}

	// Updates an existing backlog item.
	// @param alterBacklog The altered backlog data.
	// @returns An Observable of the server response.
	putAlterBacklog(alterBacklog: AlterBacklog) {
		const url = `${this.host}/putAlterBacklog`;
		return this.http.put(url, alterBacklog);
	}

	// Creates a new work item.
	// @param newWork The new work data.
	// @returns An Observable of the server response.
	postNewWork(newWork: NewWork) {
		const url = `${this.host}/postNewWork`;
		return this.http.post(url, newWork);
	}

	// Updates an existing work item.
	// @param alterWork The altered work data.
	// @returns An Observable of the server response.
	putAlterWork(alterWork: AlterWork) {
		const url = `${this.host}/putAlterWork`;
		return this.http.put(url, alterWork);
	}

	// Deletes a work item by its ID.
	// @param workId The ID of the work item.
	// @returns An Observable of the server response.
	dropWork(workId: number) {
		const url = `${this.host}/dropWork?workId=${workId}`;
		return this.http.delete(url);
	}

	// Retrieves user assignments for a specific work item.
	// @param workId The work ID.
	// @returns An Observable of username list items.
	getWorkUserAssignment(workId: number) {
		const url = `${this.host}/getUserWorkAssignment?workId=${workId}`;
		return this.http.get<NameListItem[]>(url);
	}

	// Calculates the percentage of time elapsed between two dates.
	// @param startDate The start date.
	// @param endDate The end date.
	// @returns The percentage of the period that has elapsed.
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

	// Retrieves the current user's to-do list.
	// @returns An Observable of user to-do list items.
	getUserTodoList() {
		const url = `${this.host}/getUserTodoList?userId=${this.userIdSignal()}`;
		return this.http.get<UserTodoList[]>(url);
	}

	// Retrieves all bugs for a specific project.
	// @param projectId The project ID.
	// @returns An Observable of project bug list items.
	getProjectBugs(projectId: number) {
		const url = `${this.host}/getProjectBugs?projectId=${projectId}`;
		return this.http.get<ProjectBugList[]>(url);
	}

	// Returns the display name from a NameListItem.
	// @param nameItem The name list item.
	// @returns The display name or an empty string.
	displayName(nameItem: NameListItem): string {
		return nameItem?.name ? nameItem.name : "";
	}

	// Formats a string as a CSS class name (uppercase, spaces replaced by hyphens).
	// @param name The string to format.
	// @returns The formatted class name.
	formatClassName(name: string): string {
		return name.toUpperCase().replace(/\s+/g, "-");
	}

	// Type guard to check if the data is WorkData.
	// @param data The data to check.
	// @returns True if the data is WorkData, false otherwise.
	isWorkData(data: WorkData | BugData | undefined): data is WorkData {
		return !!data && !("defectCause" in data);
	}

	// Type guard to check if the data is BugData.
	// @param data The data to check.
	// @returns True if the data is BugData, false otherwise.
	isBugData(data: WorkData | BugData | undefined): data is BugData {
		return !!data && "defectCause" in data;
	}
}
