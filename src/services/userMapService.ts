// import logger from "@loaders/logger";

import {db} from "@db/index";

import serviceUtil from "@util/serviceUtil";
import securityUtil from "util/securityUtil";

import {iGenericServiceResult} from "@pluteojs/types/modules/commonServiceTypes";
import {httpStatusCodes} from "@pluteojs/types/modules/networkTypes";

import {
	iUserMap,
	iUserMapCreationDTO,
	iUserInvite,
} from "customTypes/appDataTypes/userMapTypes";

import {NullableString} from "@pluteojs/types/modules/commonTypes";

export default class UserMapService {
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

	public async addInvite(
		uniqueRequestId: NullableString,
		inviteDTO: {email: string; userId: string; carecircleId: string}
	): Promise<iGenericServiceResult<iUserInvite | null>> {
		return db.tx("add-carecircle", async (transaction) => {
			const {email, userId, carecircleId} = inviteDTO;
			const id = securityUtil.generateUUID();
			const userInviteRecord = await transaction.userInvites.add(
				id,
				email,
				userId,
				carecircleId
			);

			const userInvite: iUserInvite = {
				id: userInviteRecord.id,
				email: userInviteRecord.email,
				userId: userInviteRecord.user_id,
				carecircleId: userInviteRecord.carecircle_id,
			};

			return serviceUtil.buildResult(
				true,
				httpStatusCodes.SUCCESS_OK,
				uniqueRequestId,
				null,
				userInvite
			);
		});
	}
}
