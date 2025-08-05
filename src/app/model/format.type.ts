// The data of the authenticated user that will be stored to local.
// Used for session management, logic, and user info.
// The data of the authenticated user that will be stored to local.
// Used for session management, logic, and user info.
export type User = {
	userId: number;
	username: string;
	email: string;
	webRole: number;
	projectRoles: userProjectRoles[];
};

export type userProjectRoles = {
	projectId: number;
	roles: number[];
};

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

export type NewProjectInput = {
	projectName: string;
	description: string;
	createdBy: number;
	startDate: Date | null;
	targetDate: Date | null;
	picId: number;
	userRoles: UserRoleChange[];
};

export type AlterProject = {
	projectId: number;
	projectName: string | null;
	description: string | null;
	startDate: Date | null;
	targetDate: Date | null;
	picId: number | null;
	userRoles: UserRoleChange[];
};

export type NameListItem = {
	name: string;
	id: number;
};

export type NameListItemByRole = {
	roleId: number;
	roleName: string;
	users: NameListItem[];
};

export type UserRoleChange = {
	roleId: number;
	usersAdded: number[];
	usersRemoved: number[];
};

export type WorkStateCount = {
	stateName: string;
	stateId: number;
	stateCount: number;
	percentage: number;
};

export type BacklogData = {
	backlogId: number;
	backlogName: string;
	description: string;
	priorityId: number;
	priorityName: string;
	picId: number;
	picName: string;
	createdBy: string;
	startDate: Date;
	targetDate: Date;
	workStateCountList: WorkStateCount[];
};

export type NewBacklog = {
	projectId: number;
	backlogName: string;
	description: string;
	priorityId: number;
	createdBy: number;
	picId: number;
	startDate: Date | null;
	targetDate: Date | null;
};

export type AlterBacklog = {
	backlogId: number;
	backlogName?: string | null;
	description?: string | null;
	startDate?: Date | null;
	targetDate?: Date | null;
	picId?: number | null;
	priorityId?: number | null;
};

export type UserWorkByState = {
	workStateId: number;
	workStateName: string;
	works: WorkData[];
};

export type WorkData = {
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
	createdByUserName: string;
	estimatedHours: number;
	trackerId: number;
	trackerName: string;
	activityId: number;
	activityName: string;
	backlogName: string;
	projectName: string;
};

export type NewWork = {
	backlogId: number;
	workName: string;
	description: string;
	startDate: Date | null;
	targetDate: Date | null;
	picId: number | null;
	currentState: number;
	createdBy: number;
	priorityId: number;
	estimatedHours: number;
	trackerId: number;
	activityId: number;
	usersAdded: number[];
};

export type AlterWork = {
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
};

export type UserTodoList = {
	stateId: number;
	stateName: string;
	works: WorkData[];
};

export type BatteryItem = {
	name: string;
	id: number;
	count: number;
	percentage: number;
};
