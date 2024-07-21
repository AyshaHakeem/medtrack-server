export interface iMedicineDose {
	id: string;
	medicineId?: string;
	time: string;
	dose: string;
	note: string;
	logged_by_user?: string | null;
	medicine_log_date?: string | null;
}

export interface iMedicineDoseCreationDTO {
	time: string;
	dose: string;
	note: string;
}

export interface iMedicineDoseResult {
	ids: string[];
	items: {
		[id: string]: iMedicineDose;
	};
}
