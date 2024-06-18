export interface iUserMap {
	id: string;
	userId: string;
	carecircleId: string;
}

export interface iUserMapCreationDTO {
	userId: string;
	carecircleId: string;
}

export interface iUserInvite {
	id: string;
	email: string;
	userId: string;
	carecircleId: string;
}
