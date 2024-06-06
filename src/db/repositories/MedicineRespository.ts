import {IDatabase, IMain} from "pg-promise";

import {iMedicineModel} from "@db/models/medicine.model";

import {medicine as sql} from "@db/sql";

export default class MedicineRespository {
	constructor(private db: IDatabase<any>, private pgp: IMain) {}

	async create(): Promise<null> {
		return this.db.none(sql.create);
	}

	async add(
		id: string,
		patientName: string,
		name: string,
		carecircleId: string,
		fromDate: string,
		toDate: string,
		note: string
	): Promise<iMedicineModel> {
		return this.db.one(sql.add, {
			id,
			patientName,
			name,
			carecircleId,
			fromDate,
			toDate,
			note,
		});
	}

	async findById(id: string): Promise<iMedicineModel | null> {
		return this.db.oneOrNone("SELECT * FROM medicine WHERE id=$1", id);
	}

	async findByCarecircleId(
		carecircleId: string
	): Promise<iMedicineModel[] | null> {
		return this.db.manyOrNone(
			"SELECT * FROM medicine WHERE carecircle_id=$1",
			carecircleId
		);
	}
}
