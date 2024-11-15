import Joi from "joi"

export const userValidation = {
  create: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("artist", "requester").required(),
  }),
  update: Joi.object({
    email: Joi.string().email(),
    currentPassword: Joi.string(),
    newPassword: Joi.string().min(6),
  }),
}
