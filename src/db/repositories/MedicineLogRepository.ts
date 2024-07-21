import {IDatabase, IMain} from "pg-promise";

import {iMedicineLogModel} from "@db/models/medicineLog.model";

import {medicineLog as sql} from "@db/sql";

export default class MedicineLogRepository {
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
		doseId: string,
		userId: string
	): Promise<iMedicineLogModel> {
		return this.db.one(sql.add, {
			id,
			doseId,
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
