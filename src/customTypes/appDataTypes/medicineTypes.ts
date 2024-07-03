import {iMedicineDose, iMedicineDoseCreationDTO} from "./medicineDoseTypes";

export interface iMedicineWithDose {
	id: string;
	patientName: string;
	carecircleId: string;
	medicineName: string;
	fromDate: string;
	toDate: string;
	note: string;
	doses: {
		ids: string[];
		items: {
			[id: string]: iMedicineDose;
		};
	};
}

export interface iMedicineCreationDTO {
	patientName: string;
	careCircleId: string;
	medicineName: string;
	fromDate: string;
	toDate: string;
	note: string;
	doses: iMedicineDoseCreationDTO[];
}

export interface iMedicineResult {
	ids: string[];
	items: {
		[id: string]: iMedicineWithDose;
	};
}

export interface iMedicineDoseRecord {
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
