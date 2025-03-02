import {IDatabase, IMain} from "pg-promise";

import {iMedicineModel, iMedicineDoseModel} from "@db/models/medicine.model";

import {medicine as sql} from "@db/sql";

export default class MedicineRespository {
	constructor(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private db: IDatabase<any>,
		private pgp: IMain
	) {}

	async create(): Promise<null> {
		return this.db.none(sql.create);
	}

	async add(
		id: string,
		patientId: string,
		medicineName: string,
		careCircleId: string,
		fromDate: string,
		toDate: string,
		note: string
	): Promise<iMedicineModel> {
		return this.db.one(sql.add, {
			id,
			patientId,
			medicineName,
			careCircleId,
			fromDate,
			toDate,
			note,
		});
	}

	async findById(id: string): Promise<iMedicineModel | null> {
		return this.db.oneOrNone("SELECT * FROM medicine WHERE id=$1", id);
	}

	async findByCarecircleId(id: string): Promise<iMedicineModel | null> {
		return this.db.oneOrNone("SELECT * FROM medicine WHERE id=$1", id);
	}

	async findMedicineDetails(
		carecircleId: string
	): Promise<iMedicineDoseModel[] | null> {
		return this.db.manyOrNone(
			`SELECT 
                m.id AS medicine_id,
                p.patient_name,
                m.carecircle_id,
                m.name AS medicine_name,
                m.from_date,
                m.to_date,
                m.note AS medicine_note,
                d.id AS dose_id,
                d.time AS dose_time,
                d.dose AS dose_amount,
                d.note AS dose_note
            FROM 
                medicine m
            LEFT JOIN 
                medicine_dose d ON m.id = d.medicine_id
			LEFT JOIN
				patient p ON m.patient_id = p.id
            WHERE 
                m.carecircle_id = $1;`,
			carecircleId
		);
	}

	async findActiveMedicineList(
		carecircleId: string
	): Promise<iMedicineDoseModel[] | null> {
		return this.db.manyOrNone(
			`SELECT 
                m.id AS medicine_id,
                p.patient_name,
                m.carecircle_id,
                m.name AS medicine_name,
                m.from_date,
                m.to_date,
                m.note AS medicine_note,
                d.id AS dose_id,
                d.time AS dose_time,
                d.dose AS dose_amount,
                d.note AS dose_note,
				ml.id AS medicine_log_id,
				ml.user_id AS logged_by_user,
				ml.date AS medicine_log_date
            FROM 
                medicine m
            LEFT JOIN 
                medicine_dose d ON m.id = d.medicine_id
			LEFT JOIN
				patient p ON m.patient_id = p.id
			LEFT JOIN
				medicine_log ml ON d.id = ml.dose_id AND DATE(ml.date) = CURRENT_DATE
            WHERE 
                m.carecircle_id = $1
				AND CURRENT_DATE::DATE BETWEEN m.from_date AND m.to_date;`,
			carecircleId
		);
	}
}
