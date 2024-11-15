// middleware/authMiddleware.js
/**
 * Authentication middleware handling JWT tokens, cookie management,
 * and role-based authorization
 */
import jwt from "jsonwebtoken"
import User from "../models/UserModels/UserSchema.js"

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  })
}

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  })
}

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: "Not authorized - no token" })
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-passwordHash")

    if (!user || !user.active) {
      return res.status(401).json({ message: "Not authorized - invalid user" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Not authorized - token failed" })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role ${req.user.role} is not authorized` })
    }
    next()
  }
}

export const clearAuthCookie = (res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  })
}

export default {
  protect,
  authorize,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
}
