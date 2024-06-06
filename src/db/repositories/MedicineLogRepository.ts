import {IDatabase, IMain} from "pg-promise";

import {iMedicineLogModel} from "@db/models/medicineLog.model";

import {medicineLog as sql} from "@db/sql";

export default class MedicineLogRepository {
	constructor(private db: IDatabase<any>, private pgp: IMain) {}

	async create(): Promise<null> {
		return this.db.none(sql.create);
	}

	async add(
		id: string,
		doseId: string,
		date: string,
		status: string,
		userId: string
	): Promise<iMedicineLogModel> {
		return this.db.one(sql.add, {
			id,
			doseId,
			date,
			status,
			userId,
		});
	}

	async findById(id: string): Promise<iMedicineLogModel | null> {
		return this.db.oneOrNone("SELECT * FROM medicine_log WHERE id=$1", id);
	}

	async findByDoseId(doseId: string): Promise<iMedicineLogModel[]> {
		return this.db.manyOrNone(
			"SELECT * FROM medicine_log WHERE dose_id=$1",
			doseId
		);
	}

	async findByUserId(userId: string): Promise<iMedicineLogModel[]> {
		return this.db.manyOrNone(
			"SELECT * FROM medicine_log WHERE user_id=$1",
			userId
		);
	}
}
