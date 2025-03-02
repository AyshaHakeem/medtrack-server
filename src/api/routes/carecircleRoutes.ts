/// <reference types="@pluteojs/types/global/express" />

import {NextFunction, Router} from "express";
import {celebrate, Segments} from "celebrate";

import logger from "@loaders/logger";

import middlewares from "@api/middlewares";

import CarecircleService from "@services/CarecircleService";
import MedicineService from "@services/MedicineService";
import UserMapService from "@services/userMapService";
import PatientService from "services/PatientService";

import expressUtil from "@util/expressUtil";

import {
	iRequest,
	iResponse,
	RouteType,
} from "@pluteojs/types/modules/expressTypes";
import {
	iCarecircle,
	iCarecircleCreationDTO,
	iCarecircleResult,
} from "@customTypes/appDataTypes/carecircleTypes";
import {
	iMedicineResult,
	iMedicineCreationDTO,
	iMedicineWithDose,
} from "customTypes/appDataTypes/medicineTypes";

import {iUserInvite} from "customTypes/appDataTypes/userMapTypes";

import {
	iPatient,
	iPatientInputDTO,
	iPatientResult,
} from "customTypes/appDataTypes/patientTypes";

import {
	carecircleIdSchema,
	carecircleCreationSchema,
	medicineSchema,
	emailSchema,
} from "validations/carecircleSchema";
import {iMedicineLog} from "customTypes/appDataTypes/medicineLogTypes";

const route = Router();
const carecircleService = new CarecircleService();
const medicineService = new MedicineService();
const userMapService = new UserMapService();
const patientService = new PatientService();

const carecircleRoute: RouteType = (apiRouter) => {
	apiRouter.use("/carecircle", route);

	/*
		Registering isAuthorized middleware to the entire /users route
		as all the endpoint in this route needs authorization.
	*/
	route.use(middlewares.isAuthorized);
	/*
		get carecircleList
	*/
	route.get(
		"/",
		async (
			req: iRequest,
			res: iResponse<iCarecircleResult>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
			const {decodedAccessToken} = req;
			const {uid: userId} = decodedAccessToken;
			logger.debug(
				uniqueRequestId,
				"Calling GET:/carecircle endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			try {
				const result = await carecircleService.getCarecircleList(
					uniqueRequestId,
					userId
				);
				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"GET:/: carecircle :: Completed carecircleService.getCarecircleList & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(uniqueRequestId, "Error on GET:/:carecircle", error);
				return next(error);
			}
		}
	);
	/*
		add carecircle
	*/
	route.post(
		"/",
		celebrate({
			[Segments.BODY]: carecircleCreationSchema,
		}),
		async (
			req: iRequest<iCarecircleCreationDTO>,
			res: iResponse<iCarecircle>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling POST:/carecircle endpoint with body:",
				null,
				{
					requestBody: req.body,
				}
			);

			const {decodedAccessToken} = req;
			const {uid: userId} = decodedAccessToken;

			try {
				const {body} = req;
				const result = await carecircleService.addCareCircle(
					uniqueRequestId,
					body
				);
				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/: carecircle :: Completed carecircleService.addCareCircle & sending result to client:",
					null,
					{
						result,
					}
				);
				if (result.data) {
					logger.silly("creating usermap");
					const userMap = await carecircleService.addUserMap(uniqueRequestId, {
						carecircleId: result.data.id,
						userId,
					});

					logger.debug(
						uniqueRequestId,
						"POST:/: carecircle :: Completed carecircleService.addUserMap & sending result to client:",
						null,
						{
							userMap,
						}
					);
				}
				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(uniqueRequestId, "Error on POST:/:carecircle", error);
				return next(error);
			}
		}
	);
	/*
		get medicine details
	*/
	route.get(
		"/:carecircleId/medicine",
		celebrate({
			[Segments.PARAMS]: carecircleIdSchema,
		}),
		async (
			req: iRequest<{carecircleId: string}>,
			res: iResponse<iMedicineResult>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling GET:/:carecircleId/medicine endpoint with body:",
				null,
				{
					requestParams: req.params,
				}
			);

			try {
				const result = await medicineService.getMedicineDetails(
					uniqueRequestId,
					req.params.carecircleId
				);
				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"GET:/:carecircleId/medicine :: Completed medicineService.getMedicineDetails & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on GET:/:carecircleId/medicine",
					error
				);
				return next(error);
			}
		}
	);
	/*
		get active medicine details
	*/
	route.get(
		"/:carecircleId/medicine/today",
		// celebrate({
		// [Segments.PARAMS]: carecircleIdSchema,
		// }),
		async (
			req: iRequest<{carecircleId: string}>,
			res: iResponse<iMedicineResult>,
			next: NextFunction
		) => {
			logger.silly(
				`Calling GET:/:carecircleId/today endpoint with params :\n ${req.params}`
			);
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
			logger.debug(
				uniqueRequestId,
				"Calling GET:/:carecircleId/today endpoint with params:",
				null,
				{
					requestParams: req.params,
				}
			);

			try {
				const result = await medicineService.getActiveMedicineDetails(
					uniqueRequestId,
					req.params.carecircleId
				);

				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"GET:/:carecircleId/today :: Completed medicineService.getActiveMedicineDetails & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on GET:/:carecircleId/today",
					error
				);
				return next(error);
			}
		}
	);
	/*
		add medicine log record
	*/
	route.post(
		"/:carecircleId/medicine/today",
		async (
			req: iRequest<{doseId: string}>,
			res: iResponse<iMedicineLog>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
			const userId = req.decodedAccessToken.uid;

			try {
				const result = await medicineService.addMedicineLog(uniqueRequestId, {
					doseId: req.body.doseId,
					userId,
				});

				logger.debug(
					uniqueRequestId,
					"POST:/:carecircleId/today :: Completed medicineService.addMedicineLog & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(result.httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on POST:/:carecircleId/today",
					error
				);
				return next(error);
			}
		}
	);
	/*
		add medicine and dose
	*/
	route.post(
		"/:carecircleId/medicine",
		celebrate({
			[Segments.BODY]: medicineSchema,
		}),
		async (
			req: iRequest<iMedicineCreationDTO>,
			res: iResponse<iMedicineWithDose>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling POST:/carecircle/medicine endpoint with body:",
				null,
				{
					requestBody: req.body,
					requestParams: req.params,
				}
			);

			try {
				const {body} = req;
				const result = await medicineService.addMedicine(uniqueRequestId, body);
				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/:carecircleId/medicine :: Completed carecircleService.addCareCircle & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(uniqueRequestId, "Error on POST:/:carecircle", error);
				return next(error);
			}
		}
	);
	/*
		invite care giver
	*/
	route.post(
		"/:carecircleId/invite",
		celebrate({
			[Segments.BODY]: emailSchema,
		}),
		async (
			req: iRequest<{email: string}>,
			res: iResponse<iUserInvite | null>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
			try {
				const {body} = req;

				const result = await userMapService.addInvite(uniqueRequestId, {
					...body,
					userId: req.decodedAccessToken.uid,
					carecircleId: req.params.carecircleId,
				});

				const {httpStatusCode} = result;

				logger.debug(
					uniqueRequestId,
					"POST:/:carecircleId/invite :: Completed userMapService.addInvite & sending result to client:",
					null,
					{
						result,
					}
				);

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on POST:/:carecircleId/invite",
					error
				);
				return next(error);
			}
		}
	);
	/*
		get patient list
	*/
	route.get(
		"/:carecircleId/patient",
		async (
			req: iRequest<{carecircleId: string}>,
			res: iResponse<iPatientResult>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
			try {
				const result = await patientService.getPatientList(
					uniqueRequestId,
					req.params.carecircleId
				);

				const {httpStatusCode} = result;

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on GET:/:carecircleId/patients",
					error
				);
				return next(error);
			}
		}
	);
	/*
		add patient
	*/
	route.post(
		"/:carecircleId/patient",
		async (
			req: iRequest<iPatientInputDTO>,
			res: iResponse<iPatient | null>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);
			try {
				const {body} = req;

				const result = await patientService.addPatient(uniqueRequestId, {
					...body,
				});

				const {httpStatusCode} = result;

				return res.status(httpStatusCode).json(result);
			} catch (error) {
				logger.error(
					uniqueRequestId,
					"Error on POST:/:carecircleId/patient",
					error
				);
				return next(error);
			}
		}
	);
};

export default carecircleRoute;
