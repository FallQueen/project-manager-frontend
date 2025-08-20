// User model representing individual users in the system
// Used upon login to receive user's data to be stored
export type User = {
	userId: number;
	username: string;
	email: string;
	webRole: number;
	projectRoles: userProjectRoles[];
};

// Represents the roles a user has within a specific project
// Used for project-specific permissions and access control
export type userProjectRoles = {
	projectId: number;
	projectRoles: number[];
};

// Represents a project within the system
// Used for project data display and management
export type Project = {
	projectId: number;
	projectName: string;
	description: string;
	picName: string;
	startDate: Date;
	targetDate: Date;
	totalTask: number;
	doneTask: number;
};

// Represents the input data for creating a new project
// Used in project creation
export type NewProjectInput = {
	projectName: string;
	description: string;
	createdBy: number;
	startDate: Date | null;
	targetDate: Date | null;
	picId: number;
	userRoles: UserRoleChange[];
};

// Represents the data for altering an existing project
// Used in project updates
export type AlterProject = {
	projectId: number;
	projectName: string | null;
	description: string | null;
	startDate: Date | null;
	targetDate: Date | null;
	picId: number | null;
	userRoles: UserRoleChange[];
};

// Represents an item  that consists of an id and a name
// Used in data storage, user input, search functions, etc
export interface NameListItem {
	name: string;
	id: number;
}

// A specific use case for NameListItem with an added projectId
// Used in project/work search, to go to project when select work
export interface workNameListItem extends NameListItem {
	projectId: number;
}

// Represents the roles a user has within a specific project
// Used for data display and user assignment
export type NameListItemByRole = {
	roleId: number;
	roleName: string;
	users: NameListItem[];
};

// Represents a change in user assignments for a project role
// Used when updating project roles (add/remove users)
export type UserRoleChange = {
	roleId: number;
	usersAdded: number[];
	usersRemoved: number[];
};

export type ModuleData = {
	moduleId: number;
	moduleName: string;
	description: string;
	createdBy: string;
	projectName: string;
	workStateCountList?: BatteryItem[];
};

// Represent data of a sub-module
// Used for data display in cards and dialogs
export type NewModule = {
	projectId: number;
	ModuleName: string;
	description: string;
	priorityId: number;
	createdBy: number;
};

export type AlterModule = {
	ModuleId: number;
	ModuleName?: string | null;
	description?: string | null;
};

// Represent data of a sub-module
// Used for data display in cards and dialogs
export type SubModuleData = {
	subModuleId: number;
	subModuleName: string;
	description: string;
	priorityId: number;
	priorityName: string;
	picId: number;
	picName: string;
	createdBy: string;
	startDate: Date;
	targetDate: Date;
	projectName: string;
	workStateCountList?: BatteryItem[];
};

// Represents the input data for creating a new sub-module
// Used in sub-module creation dialog form
export type NewSubModule = {
	projectId: number;
	subModuleName: string;
	description: string;
	priorityId: number;
	createdBy: number;
	picId: number;
	startDate: Date | null;
	targetDate: Date | null;
};

// Represents the data for altering an existing sub-module
// Used in sub-module edit dialog
export type AlterSubModule = {
	subModuleId: number;
	subModuleName?: string | null;
	description?: string | null;
	startDate?: Date | null;
	targetDate?: Date | null;
	picId?: number | null;
	priorityId?: number | null;
};

// Represents a work item
// used for work card and detail dialog data display
export interface WorkData {
	workId: number;
	workName: string;
	priorityId: number;
	priorityName: string;
	picId: number;
	picName: string;
	description: string;
	stateId: number;
	stateName: string;
	startDate: Date;
	targetDate: Date;
	createdBy: string;
	estimatedHours: number;
	trackerId: number;
	trackerName: string;
	activityId: number;
	activityName: string;
	subModuleName: string;
	projectName: string;
}

// Represents a bug/defect item, extending WorkData.
// Used in work card and detail dialog data display
// (bug is a specific work type with extra data columns)
export interface BugData extends WorkData {
	defectCause: string;
	workAffected: string;
}

// Base interface for new work/bug creation payloads.
export interface BaseNewWork {
	workName: string;
	description: string;
	startDate: Date | null;
	targetDate: Date | null;
	picId: number | null;
	currentState: number;
	createdBy: number;
	priorityId: number;
	estimatedHours: number;
	usersAdded: number[];
}

// Represents a new work item
// Used in work creation dialog
export interface NewWork extends BaseNewWork {
	subModuleId: number;
	trackerId: number;
	activityId: number;
}

// Represents a new bug item
// Used in work creation dialog
export interface NewBug extends BaseNewWork {
	defectCause: number;
	workAffected: number;
}

// Represents a work item update payload
// Used in work update dialog
// (for work and bug data)
export interface AlterWork {
	workId: number;
	workName?: string | null;
	description?: string | null;
	startDate?: Date | null;
	targetDate?: Date | null;
	picId?: number | null;
	currentState?: number | null;
	priorityId?: number | null;
	estimatedHours?: number | null;
	trackerId?: number | null;
	activityId?: number | null;
	usersRemoved?: number[];
	usersAdded?: number[];
}

export interface AlterBug {
	defectCause?: number | null;
	workAffected?: number | null;
}

// Represents work items grouped by state that need to be worked on
// Used in user dashboard page
export type UserTodoList = {
	stateId: number;
	stateName: string;
	works: WorkData[];
};

// Represents bug items grouped by state that need to be worked on
// Used in user dashboard page
export type ProjectBugList = {
	stateId: number;
	stateName: string;
	works: BugData[];
};

// Represents the count and percentages of work items in a specific state within a module/sub-module
// Used for battery summary on module and sub-module cards
export type BatteryItem = {
	name: string;
	id: number;
	count: number;
	percentage: number;
};

// Represents the count and percentages of work items in a specific state within a module/sub-module
// Used for battery summary on module and sub-module cards
export type WorkStateCount = {
	stateName: string;
	stateId: number;
	stateCount: number;
	percentage: number;
};

export type GanttItem = {
	workId: number;
	workName: string;
	startDate: Date;
	targetDate: Date;
	trackerName: string;
	stateName: string;
	activityName: string;
	assignedUsers: NameListItem[];
};

export type GanttItemsBasedOnProject = {
	moduleId: number;
	moduleName: string;
	works: GanttItem[];
};

export type ProjectDates = {
	oldestStartDate: Date;
	newestTargetDate: Date;
};

export type GanttChartData = {
	projectDates: ProjectDates;
	ganttItemData: GanttItemsBasedOnProject[];
};

export type TimelineMonth = {
	monthName: string;
	year: number;
	days: { monthDay: number; globalIndex: number }[];
};
