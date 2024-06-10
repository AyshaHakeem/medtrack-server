/// <reference types="@pluteojs/types/global/express" />

import {NextFunction, Router} from "express";
import {celebrate, Segments} from "celebrate";

import logger from "@loaders/logger";

import middlewares from "@api/middlewares";

import CarecircleService from "@services/CarecircleService";
import MedicineService from "@services/MedicineService";

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

import {
	idSchema,
	carecircleCreationSchema,
	medicineSchema,
} from "validations/carecircleSchema";

const route = Router();
const carecircleService = new CarecircleService();
const medicineService = new MedicineService();

const userRoute: RouteType = (apiRouter) => {
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
		celebrate({
			[Segments.PARAMS]: idSchema,
		}),
		async (
			req: iRequest<{userId: string}>,
			res: iResponse<iCarecircleResult>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling GET:/carecircle endpoint with body:",
				null,
				{
					requestParams: req.params,
				}
			);

			try {
				const result = await carecircleService.getCarecircleList(
					uniqueRequestId,
					req.params.userId
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
			[Segments.PARAMS]: idSchema,
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
		celebrate({
			[Segments.PARAMS]: idSchema,
		}),
		async (
			req: iRequest<{carecircleId: string}>,
			res: iResponse<iMedicineResult>,
			next: NextFunction
		) => {
			const uniqueRequestId = expressUtil.parseUniqueRequestId(req);

			logger.debug(
				uniqueRequestId,
				"Calling GET:/:carecircleId/today endpoint with body:",
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
				const result = await medicineService.addMedicine(
					uniqueRequestId,
					req.params.careCircleId,
					body
				);
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
		add user map
	*/
};

export default userRoute;
