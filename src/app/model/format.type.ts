// The data of the authenticated user that will be stored to local.
// Used for session management, logic, and user info.
export type User = {
	userId: string;
	username: string;
	email: string;
	roleId: string;
};

// export type project = {
// 	projectId: number;
// 	projectName: string;
// 	pic: string;
// 	startDate: Date;
// 	description: string;
// 	totalTask: number;
// 	doneTask: number;
// };

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
	createdBy: string;
	startDate: Date;
	targetDate: Date;
	workStateCountList: WorkStateCount[];
};

export interface WorkData {
	workId: number;
	workName: string;
	priorityId: number;
	priorityName: string;
	picId: number;
	picUserName: string;
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
}

export type NewWork = {
	workName: string;
	description: string;
	startDate: Date;
	targetDate: Date;
	picId: number;
	createdBy: number;
	priorityId: number;
	estimatedHours: number;
	trackerId: number;
	usersAdded: number[];
};

export type AlterWork = {
	workId: number;
	workName: string | null;
	description: string | null;
	startDate: Date | null;
	targetDate: Date | null;
	picId: number | null;
	priorityId: number | null;
	estimatedHours: number | null;
	trackerId: number | null;
	usersAdded: number[];
	usersRemoved: number[];
};
