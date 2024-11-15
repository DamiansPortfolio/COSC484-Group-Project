// middleware/validateRequest.js
/**
 * Request validation middleware using Joi schemas
 */
import { AppError } from "./errorHandler.js"
import Joi from "joi"

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      throw new AppError(error.details[0].message, 400)
    }
    next()
  }
}
