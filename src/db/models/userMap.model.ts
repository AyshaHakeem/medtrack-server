export interface iUserMapModel {
	id: string;
	user_id: string;
	carecircle_id: string;
}

export interface iUserInviteModel {
	id: string;
	email: string;
	user_id: string;
	carecircle_id: string;
	status: boolean;
}
