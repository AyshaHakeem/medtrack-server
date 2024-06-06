export interface iMedicineLog {
	id: string;
	doseId: string;
	date: string;
	status: number;
	userId: string;
}

export interface iMedicineLogCreationDTO {
	doseId: string;
	date: string;
	status: number;
	userId: string;
}
