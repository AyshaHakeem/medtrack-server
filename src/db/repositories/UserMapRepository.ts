import {IDatabase, IMain} from "pg-promise";

import {iUserMapModel} from "@db/models/userMap.model";

import {userMap as sql} from "@db/sql";

export default class UserMapRepository {
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
		userId: string,
		carecircleId: string
	): Promise<iUserMapModel> {
		return this.db.one(sql.add, {
			id,
			userId,
			carecircleId,
		});
	}

	async findByUserId(userId: string): Promise<iUserMapModel[] | null> {
		return this.db.manyOrNone(
			"SELECT * FROM user_map WHERE user_is=$1",
			userId
		);
	}

	async findByCarecircleId(carecircleId: string[]): Promise<iUserMapModel[]> {
		return this.db.manyOrNone(
			"SELECT * FROM user_map WHERE carecircle_id = $1",
			carecircleId
		);
	}

	async findCarecircleIds(userId: string): Promise<any | null> {
		return this.db.manyOrNone(
			"SELECT array_agg(carecircle_id) AS carecircle_ids FROM user_map WHERE user_id=$1",
			[userId]
		);
	}

	async findUserIds(carecircleId: string): Promise<string[] | null> {
		return this.db.manyOrNone(
			"SELECT array_agg(user_id) AS user_ids FROM user_map WHERE carecircle_id=$1",
			carecircleId
		);
	}
}
