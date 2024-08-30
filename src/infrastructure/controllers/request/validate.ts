import Joi from "joi";

export const querySchema = Joi.object({
    id: Joi.string().required()
});

export const bodySchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    documentNumber: Joi.string().alphanum().min(3).max(20).required(),
    phone: Joi.string().alphanum().min(3).max(15).required(),
    address: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    creditAvailable: Joi.number()
});

export const bodyPatchSchema = Joi.object({
    creditAvailable: Joi.number().required()
});