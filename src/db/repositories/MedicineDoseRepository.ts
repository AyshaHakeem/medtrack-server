import {IDatabase, IMain} from "pg-promise";

import {iMedicineDoseModel} from "@db/models/medicineDose.model";

import {medicineDose as sql} from "@db/sql";

export default class MedicineDoseRepository {
	/**
	 * @param db
	 * Automated database connection context/interface.
	 *
	 * If you ever need to access other repositories from this one,
	 * you will have to replace type 'IDatabase<any>' with 'any'.
	 *
	 * @param pgp
	 * Library's root, if ever needed, like to access 'helpers'
	 * or other namespaces available from the root.
	 */
	constructor(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private db: IDatabase<any>,
		private pgp: IMain
	) {
		/*
          If your repository needs to use helpers like ColumnSet,
          you should create it conditionally, inside the constructor,
          i.e. only once, as a singleton.
        */
	}

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
