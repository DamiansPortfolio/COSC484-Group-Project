import Joi from "joi"

export const jobValidation = {
  create: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    budget: Joi.number().min(0).required(),
    timeline: Joi.string().required(),
    requirements: Joi.array().items(Joi.string()),
    deliverables: Joi.array().items(Joi.string()),
  }),

  update: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    budget: Joi.number().min(0),
    timeline: Joi.string(),
    requirements: Joi.array().items(Joi.string()),
    deliverables: Joi.array().items(Joi.string()),
    status: Joi.string().valid("open", "in-progress", "completed", "cancelled"),
  }),

  apply: Joi.object({
    coverLetter: Joi.string().required(),
    proposedTimeline: Joi.string().required(),
    proposedBudget: Joi.number().min(0).required(),
  }),

  search: Joi.object({
    category: Joi.string(),
    minBudget: Joi.number().min(0),
    maxBudget: Joi.number().min(0),
    status: Joi.string(),
    sortBy: Joi.string().valid("budget", "createdAt", "deadline"),
    order: Joi.string().valid("asc", "desc"),
  }),

  updateApplication: Joi.object({
    status: Joi.string()
      .valid("pending", "accepted", "rejected", "withdrawn")
      .required(),
    message: Joi.string(),
  }),
}
