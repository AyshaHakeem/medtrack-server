import Joi from "joi";
// import {uuidv4Schema} from "./genericSchemas";

// const idSchema = Joi.string().uuid().required();
const carecircleNameSchema = Joi.string().required();
const carecircleIdSchema = Joi.string().uuid().required();

const carecircleCreationSchema = Joi.object({
	name: carecircleNameSchema,
});

const emailSchema = Joi.object({
	email: Joi.string().required(),
});

const medicineDoseSchema = Joi.object({
	time: Joi.string().required(),
	dose: Joi.string().required(),
	note: Joi.string().required(),
});

const medicineSchema = Joi.object({
	patientName: Joi.string().required(),
	careCircleId: Joi.string().required(),
	medicineName: Joi.string().required(),
	fromDate: Joi.date().iso().required(),
	toDate: Joi.date().iso().required(),
	note: Joi.string().required(),
	doses: Joi.array().items(medicineDoseSchema),
});

export {
	emailSchema,
	carecircleNameSchema,
	carecircleCreationSchema,
	medicineSchema,
	carecircleIdSchema,
	// idSchema,
};
