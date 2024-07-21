import {db} from "@db/index";

import serviceUtil from "@util/serviceUtil";
import securityUtil from "@util/securityUtil";

import {iGenericServiceResult} from "@pluteojs/types/modules/commonServiceTypes";
import {httpStatusCodes} from "@pluteojs/types/modules/networkTypes";
import {
	iMedicineCreationDTO,
	iMedicineResult,
	iMedicineWithDose,
	iMedicineDoseRecord,
} from "customTypes/appDataTypes/medicineTypes";

import {iMedicineDose} from "customTypes/appDataTypes/medicineDoseTypes";

import {NullableString} from "@pluteojs/types/modules/commonTypes";

export default class MedicineService {
	// add a medicine record and related dose records
	public async addMedicine(
		uniqueRequestId: NullableString,
		medicineDTO: iMedicineCreationDTO
	): Promise<iGenericServiceResult<iMedicineWithDose | null>> {
		return db.tx("add-medicine-with-dose", async (transaction) => {
			const doseIds: string[] = [];
			const doseItems: {[id: string]: iMedicineDose} = {};
			const {
				patientId,
				medicineName,
				careCircleId,
				fromDate,
				toDate,
				note,
				doses,
			} = medicineDTO;
			const id = securityUtil.generateUUID();
			const medicineRecord = await transaction.medicines.add(
				id,
				patientId,
				medicineName,
				careCircleId,
				fromDate,
				toDate,
				note
			);

			doses.forEach(async (dose) => {
				const doseId = securityUtil.generateUUID();
				const doseRecord = await transaction.medicineDoses.add(
					doseId,
					medicineRecord.id,
					dose.time,
					dose.dose,
					dose.note
				);
				doseIds.push(doseRecord.id);
				doseItems[doseRecord.id] = {
					id: doseRecord.id,
					medicineId: medicineRecord.id,
					time: doseRecord.time,
					dose: doseRecord.dose,
					note: doseRecord.note,
				};
			});

			const medicine: iMedicineWithDose = {
				id: medicineRecord.id,
				patientName: medicineRecord.patient_id,
				carecircleId: medicineRecord.carecircle_id,
				medicineName: medicineRecord.name,
				fromDate: medicineRecord.from_date,
				toDate: medicineRecord.to_date,
				note: medicineRecord.note,
				doses: {
					ids: doseIds,
					items: doseItems,
				},
			};
			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_CREATED,
				uniqueRequestId,
				null,
				medicine
			);
		});
	}

	// return all medicine records with doses under a carecircle
	public async getMedicineDetails(
		uniqueRequestId: NullableString,
		carecircleId: string
	): Promise<iGenericServiceResult<iMedicineResult | null>> {
		return db.tx("get-medicine-details", async (transaction) => {
			const ids: string[] = [];
			const items: {[id: string]: iMedicineWithDose} = {};
			const medicineRecords: iMedicineDoseRecord[] | null =
				await transaction.medicines.findMedicineDetails(carecircleId);

			if (!medicineRecords || medicineRecords.length === 0) {
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.SUCCESS_NO_CONTENT,
					uniqueRequestId,
					null
				);
			}

			medicineRecords.forEach((record) => {
				if (!items[record.medicine_id]) {
					ids.push(record.medicine_id);
					items[record.medicine_id] = {
						id: record.medicine_id,
						patientName: record.patient_name,
						carecircleId: record.carecircle_id,
						medicineName: record.medicine_name,
						fromDate: record.from_date,
						toDate: record.to_date,
						note: record.medicine_note,
						doses: {
							ids: [],
							items: {},
						},
					};
				}

				const {doses} = items[record.medicine_id];

				if (!doses.ids.includes(record.dose_id)) {
					doses.ids.push(record.dose_id);
					doses.items[record.dose_id] = {
						id: record.dose_id,
						dose: record.dose_amount,
						time: record.dose_time,
						note: record.dose_note,
						medicineId: record.medicine_id,
					};
				}
			});
			const medicineList: iMedicineResult = {
				ids,
				items,
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				medicineList
			);
		});
	}

	// return active medicine records with doses
	public async getActiveMedicineDetails(
		uniqueRequestId: NullableString,
		carecircleId: string
	): Promise<iGenericServiceResult<iMedicineResult | null>> {
		return db.tx("get-medicine-details", async (transaction) => {
			const ids: string[] = [];
			const items: {[id: string]: iMedicineWithDose} = {};
			const medicineRecords: iMedicineDoseRecord[] | null =
				await transaction.medicines.findActiveMedicineList(carecircleId);

			if (!medicineRecords || medicineRecords.length === 0) {
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.SUCCESS_NO_CONTENT,
					uniqueRequestId,
					null
				);
			}

			medicineRecords.forEach((record) => {
				if (!items[record.medicine_id]) {
					ids.push(record.medicine_id);
					items[record.medicine_id] = {
						id: record.medicine_id,
						patientName: record.patient_name,
						carecircleId: record.carecircle_id,
						medicineName: record.medicine_name,
						fromDate: record.from_date,
						toDate: record.to_date,
						note: record.medicine_note,
						doses: {
							ids: [],
							items: {},
						},
					};
				}

				if (!items[record.medicine_id].doses.ids.includes(record.dose_id)) {
					items[record.medicine_id].doses.ids.push(record.dose_id);
					items[record.medicine_id].doses.items[record.dose_id] = {
						id: record.dose_id,
						dose: record.dose_amount,
						time: record.dose_time,
						note: record.dose_note,
						logged_by_user: record.logged_by_user,
						medicine_log_date: record.medicine_log_date,
					};
				}
			});
			const medicineList: iMedicineResult = {
				ids,
				items,
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				medicineList
			);
		});
	}
}
