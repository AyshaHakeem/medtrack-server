import {IDatabase, IMain} from "pg-promise";

import {iMedicineDoseModel} from "@db/models/medicineDose.model";

import {medicineDose as sql} from "@db/sql";

export default class MedicineDoseRepository {
	constructor(private db: IDatabase<any>, private pgp: IMain) {}

	async create(): Promise<null> {
		return this.db.none(sql.create);
	}

	async add(
		id: string,
		medicineId: string,
		time: string,
		dose: string,
		note: string
	): Promise<iMedicineDoseModel> {
		return this.db.one(sql.add, {
			id,
			medicineId,
			time,
			dose,
			note,
		});
	}

	async findById(id: string): Promise<iMedicineDoseModel | null> {
		return this.db.oneOrNone("SELECT * FROM medicine_dose WHERE id=$1", id);
	}

	async findByMedicineId(medicineId: string): Promise<iMedicineDoseModel[]> {
		return this.db.manyOrNone(
			"SELECT * FROM medicine_dose WHERE medicine_id=$1",
			medicineId
		);
	}

	async findByMedicineIds(
		medicineIds: string[]
	): Promise<iMedicineDoseModel[]> {
		return this.db.manyOrNone(
			"SELECT * FROM medicine_dose WHERE medicine_id = ANY($1::uuid[])",
			medicineIds
		);
	}
}
