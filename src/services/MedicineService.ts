import {db} from "@db/index";

import serviceUtil from "@util/serviceUtil";

import {iGenericServiceResult} from "@pluteojs/types/modules/commonServiceTypes";
import {httpStatusCodes} from "@pluteojs/types/modules/networkTypes";
import {
	iMedicineResult,
	iMedicineWithDose,
	iMedicineDoseRecord,
} from "customTypes/appDataTypes/medicineTypes";

import {NullableString} from "@pluteojs/types/modules/commonTypes";

export default class MedicineService {
	public async getMedicineDetails(
		uniqueRequestId: NullableString,
		carecircleId: string
	): Promise<iGenericServiceResult<iMedicineResult | null>> {
		// medicine -> where cc equals | dose -> where medicine equals
		return db.tx("get-medicine-details", async (transaction) => {
			// const MedicineWithDose: iMedicineWithDose = {};
			const ids: string[] = [];
			const items: {[id: string]: iMedicineWithDose} = {};
			const medicineRecords: iMedicineDoseRecord[] | null =
				await transaction.medicines.findByCarecircleId(carecircleId);

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
						name: record.medicine_name,
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
						name: record.medicine_name,
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
}
