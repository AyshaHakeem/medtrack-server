export interface iMedicineModel {
	id: string;
	patient_name: string;
	carecircle_id: string;
	name: string;
	from_date: string;
	to_date: string;
	note: string;
}

export interface iMedicineDoseModel {
	medicine_id: string;
	patient_name: string;
	carecircle_id: string;
	medicine_name: string;
	from_date: string;
	to_date: string;
	medicine_note: string;
	dose_id: string;
	dose_amount: string;
	dose_time: string;
	dose_note: string;
}
