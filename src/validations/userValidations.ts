import * as Joi from "@hapi/joi";

const createUserValidation = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().max(16).email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().allow(null).empty("").optional(),
    firstName: Joi.string().allow(null).empty("").optional(),
    lastName: Joi.string().allow(null).empty("").optional(),
    otherNames: Joi.string().allow(null).empty("").optional(),
    profilePicture: Joi.string().allow(null).empty("").optional(),
    avatar: Joi.string().allow(null).empty("").optional(),
    customMessage: Joi.string().allow(null).empty("").optional(),
});

const updateUserValidation = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().max(16).allow(null).empty("").optional(),
    password: Joi.string().min(8).allow(null).empty("").optional(),
    phone: Joi.string().allow(null).empty("").optional(),
    firstName: Joi.string().allow(null).empty("").optional(),
    lastName: Joi.string().allow(null).empty("").optional(),
    otherNames: Joi.string().allow(null).empty("").optional(),
    profilePicture: Joi.string().allow(null).empty("").optional(),
    avatar: Joi.string().allow(null).empty("").optional(),
    customMessage: Joi.string().allow(null).empty("").optional(),
});

const getUserByIdValidation = Joi.object({
    id: Joi.string().required(),
});

export { createUserValidation, updateUserValidation, getUserByIdValidation };
