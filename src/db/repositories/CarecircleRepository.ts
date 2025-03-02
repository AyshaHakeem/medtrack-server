import {IDatabase, IMain} from "pg-promise";

import {iCarecircleModel} from "@db/models/carecircle.model";

import {carecircle as sql} from "@db/sql";

export default class CareCircleRepository {
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

	async add(id: string, name: string): Promise<iCarecircleModel> {
		return this.db.one(sql.add, {
			id,
			name,
		});
	}

	async findById(id: string): Promise<iCarecircleModel | null> {
		return this.db.oneOrNone("SELECT * FROM carecircle WHERE id=$1", id);
	}

	async findByIds(ids: string[]): Promise<iCarecircleModel[]> {
		return this.db.manyOrNone(
			"SELECT * FROM carecircle WHERE id = ANY($1::uuid[])",
			[ids]
		);
	}
}
