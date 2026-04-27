import { ApiResponse } from "../utils/ApiResponse";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyJWT } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: unknown;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  try {
    const decoded = verifyJWT(token);
    if (!decoded) {
      return next(new ApiError(401, "Authentication token is invalid."));
    }
    let userData = decoded;

    if (typeof decoded === "object" && "id" in decoded) {
      userData = {
        id: decoded.id,
      };
    }

    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).json(new ApiResponse(401, null, "Invalid token"));
  }
};

export default authMiddleware;
