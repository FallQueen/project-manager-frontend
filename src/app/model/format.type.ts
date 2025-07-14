// The data of the authenticated user that will be stored to local.
// Used for session management, logic, and user info.
export type User = {
	userId: string;
	userName: string;
	email: string;
	roleId: string;
};

export type project = {
	projectId: number;
	projectName: string;
	pic: string;
	startDate: Date;
	description: string;
	totalTask: number;
	doneTask: number;
};
