export interface iPatient {
	id: string;
	patientName: string;
	careCircleId: string;
}

export interface iPatientInputDTO {
	patientName: string;
	careCircleId: string;
}

export interface iPatientResult {
	ids: string[];
	items: {
		[id: string]: {
			id: string;
			patientName: string;
		};
	};
}
