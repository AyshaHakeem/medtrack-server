export interface iUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	createdAt: string;
}

export interface iUserInputDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface iUserResult {
	ids: string[];
	items: {
		[userId: string]: iUser;
	};
}
