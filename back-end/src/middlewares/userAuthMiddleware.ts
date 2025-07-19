import { JwtPayload } from "jsonwebtoken";
import { JwtService } from "../services/jwt/jwt";
import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constant";

const tokenService = new JwtService();

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface CustomRequest extends Request {
  user: CustomJwtPayload;
  file?: Express.Multer.File;
}

export const userAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken 

    console.log("userAuthMiddleware - Token:", token);
    console.log("userAuthMiddleware - Request URL:", req.originalUrl);

    if (!token) {
      console.log("userAuthMiddleware - No token provided");
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
    }

    const user = tokenService.verifyAccessToken(token) as CustomJwtPayload;
    if (!user) {
      console.log("userAuthMiddleware - Invalid user data");
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }

    (req as CustomRequest).user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      console.log("userAuthMiddleware - Token expired");
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.TOKEN_EXPIRED });
    }

    console.error("userAuthMiddleware - Invalid token:", error);
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.INVALID_TOKEN });
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as CustomRequest).user;
    console.log("authorizeRole - User Role:", user?.role);
    if (!user) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.NOT_ALLOWED,
        userRole: "None",
      });
    }

    const userRole = user.role.toLowerCase();
    const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());
    if (!allowedRolesLower.includes(userRole)) {
      console.log("authorizeRole - Access denied");
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.NOT_ALLOWED,
        userRole: user.role,
      });
    }

    console.log("authorizeRole - Access granted");
    next();
  };
};
