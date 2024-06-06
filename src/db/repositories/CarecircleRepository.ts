import {IDatabase, IMain} from "pg-promise";

import {iCarecircleModel} from "@db/models/carecircle.model";

import {carecircle as sql} from "@db/sql";

export default class CareCircleRepository {
	constructor(private db: IDatabase<any>, private pgp: IMain) {}

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
