// import logger from "@loaders/logger";

import {db} from "@db/index";

import serviceUtil from "@util/serviceUtil";
import securityUtil from "util/securityUtil";

import {iGenericServiceResult} from "@pluteojs/types/modules/commonServiceTypes";
import {httpStatusCodes} from "@pluteojs/types/modules/networkTypes";
import {iUser, iUserResult} from "@customTypes/appDataTypes/userTypes";
import {
	iCarecircle,
	iCarecircleResult,
	iCarecircleCreationDTO,
} from "@customTypes/appDataTypes/carecircleTypes";

import {
	iUserMap,
	iUserMapCreationDTO,
} from "customTypes/appDataTypes/userMapTypes";

import {NullableString} from "@pluteojs/types/modules/commonTypes";

export default class CarecircleService {
	// add new carecircle
	public async addCareCircle(
		uniqueRequestId: NullableString,
		carecircleDTO: iCarecircleCreationDTO
	): Promise<iGenericServiceResult<iCarecircle | null>> {
		return db.tx("add-carecircle", async (transaction) => {
			const {name} = carecircleDTO;
			const id = securityUtil.generateUUID();
			const carecircleRecord = await transaction.carecircles.add(id, name);

			const carecircle: iCarecircle = {
				id: carecircleRecord.id,
				name: carecircleRecord.name,
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				carecircle
			);
		});
	}

	public async addUserMap(
		uniqueRequestId: NullableString,
		userMapDTO: iUserMapCreationDTO
	): Promise<iGenericServiceResult<iUserMap | null>> {
		return db.tx("add-carecircle", async (transaction) => {
			const {userId, carecircleId} = userMapDTO;
			const id = securityUtil.generateUUID();
			const userMapRecord = await transaction.userMaps.add(
				id,
				userId,
				carecircleId
			);

			const userMap: iUserMap = {
				id: userMapRecord.id,
				userId: userMapRecord.user_id,
				carecircleId: userMapRecord.carecircle_id,
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				userMap
			);
		});
	}

	// return list of carecircles of a user
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

	// return list of caregivers of a carecircle
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
