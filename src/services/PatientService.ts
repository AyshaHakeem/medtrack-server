import {
	httpStatusCodes,
	iGenericServiceResult,
	NullableString,
} from "@pluteojs/types";
import {
	iPatient,
	iPatientInputDTO,
	iPatientResult,
} from "customTypes/appDataTypes/patientTypes";

import {db} from "db";

import securityUtil from "util/securityUtil";
import serviceUtil from "util/serviceUtil";

import {genericServiceErrors} from "constants/errors/genericServiceErrors";

export default class PatientService {
	// add new patient
	public async addPatient(
		uniqueRequestId: NullableString,
		patientDTO: iPatientInputDTO
	): Promise<iGenericServiceResult<iPatient | null>> {
		return db.tx("add patient", async (transaction) => {
			const id = securityUtil.generateUUID();
			const {patientName, careCircleId} = patientDTO;

			try {
				const patientRecord = await transaction.patients.add(
					id,
					patientName,
					careCircleId
				);

				const patient = {
					id: patientRecord.id,
					patientName: patientRecord.patient_name,
					careCircleId: patientRecord.carecircle_id,
				};

				return serviceUtil.buildResult(
					true,
					httpStatusCodes.SUCCESS_OK,
					uniqueRequestId,
					null,
					patient
				);
			} catch (error) {
				console.error(error);
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.CLIENT_ERROR_BAD_REQUEST,
					uniqueRequestId,
					genericServiceErrors.errors.SomethingWentWrong
				);
			}
		});
	}

	// return list of patients associated with care circle
	public async getPatientList(
		uniqueRequestId: NullableString,
		carecircleId: string
	): Promise<iGenericServiceResult<iPatientResult | null>> {
		return db.tx("get-patients-list", async (transaction) => {
			try {
				const patientRecords = await transaction.patients.findByCareCircleId(
					carecircleId
				);

				const ids: string[] = [];
				const items: {[id: string]: {id: string; patientName: string}} = {};

				patientRecords.forEach((record) => {
					ids.push(record.id);
					items[record.id] = {
						id: record.id,
						patientName: record.patient_name,
					};
				});

				const patients: iPatientResult = {
					ids,
					items,
				};
				return serviceUtil.buildResult(
					true,
					httpStatusCodes.SUCCESS_OK,
					uniqueRequestId,
					null,
					patients
				);
			} catch (error) {
				console.error("Error fetching patient list:", error);
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.SERVER_ERROR_BAD_GATEWAY,
					uniqueRequestId,
					genericServiceErrors.errors.SomethingWentWrong
				);
			}
		});
	}
}
