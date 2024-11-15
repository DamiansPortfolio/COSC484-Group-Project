// middleware/errorHandler.js
/**
 * Global error handling middleware with environment-specific responses
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error"
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong!"
      : err.message

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  })
}
