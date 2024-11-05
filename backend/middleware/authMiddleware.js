// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/UserModels/UserSchema.js";

// Utility function to generate tokens
export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Utility function to set secure cookies
export const setTokenCookies = (res, accessToken, refreshToken) => {
  // Access token cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/users/refresh-token", // Only sent to refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Main authentication middleware
export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized - no token",
      });
    }

    try {
      // Verify access token
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

      // Get user from database (excluding sensitive fields)
      const user = await User.findById(decoded.id).select(
        "-passwordHash -refreshTokens -emailVerificationToken -passwordResetToken"
      );

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Not authorized - user not found",
        });
      }

      if (!user.active) {
        return res.status(401).json({
          status: "error",
          message: "Account is deactivated",
        });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({
          status: "error",
          message: "Email not verified",
          isEmailVerified: false,
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Token expired",
          code: "TOKEN_EXPIRED",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      status: "error",
      message: "Not authorized - token failed",
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized - no user",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: `Role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};

// Refresh token verification middleware
export const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: "error",
        message: "No refresh token provided",
      });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Get user and validate refresh token
      const user = await User.findById(decoded.id);

      if (!user || !(await user.validateRefreshToken(refreshToken))) {
        return res.status(401).json({
          status: "error",
          message: "Invalid refresh token",
        });
      }

      req.user = user;
      req.refreshToken = refreshToken;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Refresh token expired",
          code: "REFRESH_TOKEN_EXPIRED",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Refresh token verification error:", error);
    res.status(401).json({
      status: "error",
      message: "Invalid refresh token",
    });
  }
};

// Optional auth middleware - doesn't require authentication but will process token if present
export const optionalAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next(); // Continue without authentication
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select(
        "-passwordHash -refreshTokens -emailVerificationToken -passwordResetToken"
      );

      if (user && user.active) {
        req.user = user;
      }
    } catch (error) {
      // Don't throw error for optional auth
      console.log("Optional auth token verification failed:", error.message);
    }

    next();
  } catch (error) {
    next();
  }
};

// Clear auth cookies utility
export const clearAuthCookies = (res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};

// Request rate limiting (basic implementation - consider using Redis for production)
export const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: "error",
    message: "Too many requests, please try again later",
  },
  handler: (req, res) => {
    res.status(429).json(rateLimit.message);
  },
};

export default {
  protect,
  authorize,
  verifyRefreshToken,
  optionalAuth,
  generateTokens,
  setTokenCookies,
  clearAuthCookies,
  rateLimit,
};
