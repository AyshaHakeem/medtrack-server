export interface iMedicineLog {
	id: string;
	medicineId: string;
	date: string;
	status: number;
	userId: string;
}

export interface iMedicineLogCreationDTO {
	medicineId: string;
	date: string;
	status: number;
	userId: string;
}
