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
	userRoles: NameListItemByRole[];
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
