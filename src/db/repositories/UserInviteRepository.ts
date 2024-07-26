import {IDatabase, IMain} from "pg-promise";

import {iUserInviteModel} from "@db/models/userMap.model";

import {invites as sql} from "@db/sql";

export default class UserInviteRepository {
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
		email: string,
		userId: string,
		carecircleId: string,
		status: boolean
	): Promise<iUserInviteModel> {
		return this.db.one(sql.add, {
			id,
			email,
			userId,
			carecircleId,
			status,
		});
	}

	async findByUserEmail(email: string): Promise<iUserInviteModel[] | null> {
		return this.db.manyOrNone("SELECT * FROM invites WHERE email=$1", email);
	}

	async findByUserId(userId: string): Promise<iUserInviteModel[] | null> {
		return this.db.manyOrNone("SELECT * FROM invites WHERE user_id=$1", userId);
	}
}
