import {iMedicineDose} from "./medicineDoseTypes";

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

export interface iMedicineWithDose extends iMedicine {
	doses: {
		ids: string[];
		items: {
			[id: string]: iMedicineDose;
		};
	};
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
	dose_id?: string;
	dose_amount?: string;
	dose_time?: string;
	dose_note?: string;
}
