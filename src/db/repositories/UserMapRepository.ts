import {IDatabase, IMain} from "pg-promise";

import {iUserMapModel} from "@db/models/userMap.model";

import {userMap as sql} from "@db/sql";

export default class MedicineDoseRepository {
	constructor(private db: IDatabase<any>, private pgp: IMain) {}

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
}
