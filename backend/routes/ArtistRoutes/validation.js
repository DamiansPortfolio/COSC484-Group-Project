import Joi from "joi"

export const artistValidation = {
  updateProfile: Joi.object({
    bio: Joi.string(),
    skills: Joi.array().items(Joi.string()),
    hourlyRate: Joi.number().min(0),
    availability: Joi.string(),
    specialization: Joi.array().items(Joi.string()),
    languages: Joi.array().items(Joi.string()),
    location: Joi.string(),
    experience: Joi.string(),
  }),
  portfolioItem: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    imageUrl: Joi.string().uri(),
    tags: Joi.array().items(Joi.string()),
    category: Joi.string(),
    completionDate: Joi.date(),
  }),
}
