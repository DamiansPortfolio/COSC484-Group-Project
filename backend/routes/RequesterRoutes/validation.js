export const requesterValidation = {
  updateProfile: Joi.object({
    companyName: Joi.string(),
    description: Joi.string(),
    website: Joi.string().uri(),
  }),
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }),
}
