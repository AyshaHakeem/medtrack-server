export interface iMedicine {
	id: string;
	patientName: string;
	carecircleId: string;
	name: string;
	fromDate: string;
	toDate: string;
	note: string;
}

export interface iMedicineCreationDTO {
	patientName: string;
	careCircleId: string;
	name: string;
	fromDate: string;
	toDate: string;
	note: string;
}
