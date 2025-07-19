"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.userAuthMiddleware = void 0;
const jwt_1 = require("../services/jwt/jwt");
const constant_1 = require("../shared/constant");
const tokenService = new jwt_1.JwtService();
const userAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.accessToken;
        console.log("userAuthMiddleware - Token:", token);
        console.log("userAuthMiddleware - Request URL:", req.originalUrl);
        if (!token) {
            console.log("userAuthMiddleware - No token provided");
            return res
                .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
                .json({ message: constant_1.ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
        }
        const user = tokenService.verifyAccessToken(token);
        if (!user) {
            console.log("userAuthMiddleware - Invalid user data");
            return res
                .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
                .json({ message: constant_1.ERROR_MESSAGES.INVALID_TOKEN });
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof Error && error.name === "TokenExpiredError") {
            console.log("userAuthMiddleware - Token expired");
            return res
                .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
                .json({ message: constant_1.ERROR_MESSAGES.TOKEN_EXPIRED });
        }
        console.error("userAuthMiddleware - Invalid token:", error);
        return res
            .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ message: constant_1.ERROR_MESSAGES.INVALID_TOKEN });
    }
});
exports.userAuthMiddleware = userAuthMiddleware;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        console.log("authorizeRole - User Role:", user === null || user === void 0 ? void 0 : user.role);
        if (!user) {
            return res.status(constant_1.HTTP_STATUS.FORBIDDEN).json({
                message: constant_1.ERROR_MESSAGES.NOT_ALLOWED,
                userRole: "None",
            });
        }
        const userRole = user.role.toLowerCase();
        const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());
        if (!allowedRolesLower.includes(userRole)) {
            console.log("authorizeRole - Access denied");
            return res.status(constant_1.HTTP_STATUS.FORBIDDEN).json({
                message: constant_1.ERROR_MESSAGES.NOT_ALLOWED,
                userRole: user.role,
            });
        }
        console.log("authorizeRole - Access granted");
        next();
    };
};
exports.authorizeRole = authorizeRole;
