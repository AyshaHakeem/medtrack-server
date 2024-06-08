export interface iCarecircle {
	id: string;
	name: string;
}

export interface iCarecircleCreationDTO {
	name: string;
}

export interface iCarecircleResult {
	ids: string[];
	items: {
		[carecircleId: string]: iCarecircle;
	};
}
