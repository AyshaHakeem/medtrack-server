import {IDatabase, IMain} from "pg-promise";

import {iPatientListModel, iPatientModel} from "@db/models/patient.model";

import {patients as sql} from "@db/sql";

export default class PatientRepository {
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
		patientName: string,
		carecircleId: string
	): Promise<iPatientModel> {
		return this.db.one(sql.add, {
			id,
			patientName,
			carecircleId,
		});
	}

	async findByCareCircleId(carecircleId: string): Promise<iPatientListModel[]> {
		return this.db.manyOrNone(
			`SELECT
				p.id,
				p.patient_name
			FROM
				patients p
			WHERE
				p.carecircle_id = $1;
			`,
			carecircleId
		);
	}
}
