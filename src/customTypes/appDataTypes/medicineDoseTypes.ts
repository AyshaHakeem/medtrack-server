export interface iMedicineDose {
	id: string;
	medicineId: string;
	time: string;
	dose: string;
	note: string;
}

export interface iMedicineDoseCreationDTO {
	medicineId: string;
	time: string;
	dose: string;
	note: string;
}
