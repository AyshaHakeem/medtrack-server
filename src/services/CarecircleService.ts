// import logger from "@loaders/logger";

import {db} from "@db/index";

import serviceUtil from "@util/serviceUtil";

import {iGenericServiceResult} from "@pluteojs/types/modules/commonServiceTypes";
import {httpStatusCodes} from "@pluteojs/types/modules/networkTypes";
import {iUser, iUserResult} from "@customTypes/appDataTypes/userTypes";
import {
	iCarecircle,
	iCarecircleResult,
} from "@customTypes/appDataTypes/carecircleTypes";

import {NullableString} from "@pluteojs/types/modules/commonTypes";

export default class CarecircleService {
	public async getCarecircleList(
		uniqueRequestId: NullableString,
		userId: string
	): Promise<iGenericServiceResult<iCarecircleResult | null>> {
		return db.tx("get-carecircles-list", async (transaction) => {
			const items: {[key: string]: iCarecircle} = {};
			const ids: string[] = [];

			const userMapRecords = await transaction.userMaps.findCarecircleIds(
				userId
			);

			if (!userMapRecords || userMapRecords.length === 0) {
				return serviceUtil.buildResult(
					false,
					httpStatusCodes.SUCCESS_NO_CONTENT,
					uniqueRequestId,
					null
				);
			}

			const carecircleRecords = await transaction.carecircles.findByIds(
				userMapRecords
			);

			carecircleRecords.forEach((carecircle) => {
				ids.push(carecircle.id);
				items[carecircle.id] = {
					id: carecircle.id,
					name: carecircle.name,
				};
			});

			// build result
			const carecircleList: iCarecircleResult = {
				ids,
				items,
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				carecircleList
			);
		});
	}

	public async getCareGiverDetails(
		uniqueRequestId: NullableString,
		carecircleId: string
	): Promise<iGenericServiceResult<iUserResult | null>> {
		return db.tx("get-caregiver-list", async (transaction) => {
			const ids: string[] = [];
			const items: {[id: string]: iUser} = {};
			const userMapRecords = await transaction.userMaps.findUserIds(
				carecircleId
			);

			if (!userMapRecords) {
				return serviceUtil.buildResult(
					true,
					httpStatusCodes.SUCCESS_NO_CONTENT,
					uniqueRequestId,
					null
				);
			}

			userMapRecords.forEach(async (id: string) => {
				ids.push(id);
				const userRecord = await transaction.users.findById(id);
				if (userRecord) {
					items[id] = {
						id: userRecord.id,
						firstName: userRecord.first_name,
						lastName: userRecord.last_name,
						email: userRecord.email,
						createdAt: userRecord.created_at,
					};
				}
			});
			// build result
			const careGiverList: iUserResult = {
				ids,
				items,
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				careGiverList
			);
		});
	}
}
