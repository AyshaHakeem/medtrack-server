import pgPromise from "pg-promise";

import UsersRepository from "./UsersRepository";
import CareCircleRepository from "./CarecircleRepository";
import MedicineRespository from "./MedicineRespository";
import MedicineDoseRepository from "./MedicineDoseRepository";
import MedicineLogRepository from "./MedicineLogRepository";
import UserMapRepository from "./UserMapRepository";
import EmailLogsRepository from "./EmailLogsRepository";
import ResetPasswordRepository from "./ResetPasswordRepository";
import EmailVerificationRequestLogsRepository from "./EmailVerificationRequestLogsRepository";

/**
 * Database Interface Extensions:
 */
interface iDBInterfaceExtensions {
	users: UsersRepository;
	carecircles: CareCircleRepository;
	medicines: MedicineRespository;
	medicineDoses: MedicineDoseRepository;
	medicineLogs: MedicineLogRepository;
	userMaps: UserMapRepository;
	emailLogs: EmailLogsRepository;
	resetPasswordLogs: ResetPasswordRepository;
	emailVerificationRequestLogs: EmailVerificationRequestLogsRepository;
}

type DBTaskType = pgPromise.ITask<iDBInterfaceExtensions> &
	iDBInterfaceExtensions;

type NullableDBTaskType = DBTaskType | null;

export {
	iDBInterfaceExtensions,
	UsersRepository,
	EmailLogsRepository,
	ResetPasswordRepository,
	EmailVerificationRequestLogsRepository,
};

export type {DBTaskType, NullableDBTaskType};
