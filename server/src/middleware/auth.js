import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.erp_access_token;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-passwordHash");

    if (!user || user.status !== "ACTIVE") {
      throw new ApiError(401, "User is not active");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Invalid or expired session"));
    }
    next(error);
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission for this action"));
    }
    next();
  };
}
