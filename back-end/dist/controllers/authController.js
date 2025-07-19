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
exports.AuthController = void 0;
const constant_1 = require("../shared/constant");
const custom_error_1 = require("../util/custom.error");
const cookieHelper_1 = require("../util/cookieHelper");
const zod_1 = require("zod");
class AuthController {
    constructor(_authService, _jwtService) {
        this._authService = _authService;
        this._jwtService = _jwtService;
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                console.log("Controller Data:", data);
                const savedUser = yield this._authService.registerUser(data);
                res.status(constant_1.HTTP_STATUS.CREATED).json({
                    success: true,
                    message: constant_1.SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
                    data: savedUser,
                });
            }
            catch (error) {
                console.error("Registration Error:", error);
                if (error instanceof zod_1.z.ZodError) {
                    return res.status(constant_1.HTTP_STATUS.BAD_REQUEST).json({
                        success: false,
                        message: error.errors.map((e) => e.message).join(", "),
                    });
                }
                if (error instanceof custom_error_1.CustomError) {
                    console.log("errrrororororro - CustomError:", error.message, error.statusCode);
                    return res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                    });
                }
                res.status(constant_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constant_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { user, accessToken, refreshToken } = yield this._authService.loginUser(data);
                (0, cookieHelper_1.setAuthCookies)(res, accessToken, refreshToken, "accessToken", "refreshToken");
                res.status(constant_1.HTTP_STATUS.OK).json({
                    message: constant_1.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                        dob: user.dob,
                        preferences: user.preferences
                    },
                });
            }
            catch (error) {
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({ success: false, message: error.message });
                    return;
                }
                console.log(error);
                res.status(constant_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: constant_1.ERROR_MESSAGES.SERVER_ERROR,
                });
            }
        });
    }
    logoutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res
                    .clearCookie("accessToken")
                    .clearCookie("refreshToken")
                    .status(200)
                    .json({ message: "Logout successful" });
            }
            catch (error) {
                if (error instanceof custom_error_1.CustomError) {
                    res.status(error.statusCode).json({ error: error.message });
                    return;
                }
                console.log(error);
                res
                    .status(constant_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: constant_1.ERROR_MESSAGES.SERVER_ERROR });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this._authService.forgotPassword(email);
                res.status(constant_1.HTTP_STATUS.OK).json({ message: "OTP sent successfully" });
            }
            catch (error) {
                console.log(error);
                res.status(error.status || 500).json({ message: error.message });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const isValid = yield this._authService.verifyResetOtp({
                    email,
                    otp: Number(otp),
                });
                if (!isValid) {
                    return res.status(constant_1.HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid or expired OTP" });
                }
                res.status(constant_1.HTTP_STATUS.OK).json({ message: "OTP verified successfully" });
            }
            catch (error) {
                res.status(error.status || 500).json({ message: error.message });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const userId = req.user.id
                const data = req.body;
                console.log("suii", data);
                const updated = yield this._authService.resetPassword(data);
                console.log("iiiiiiiii", updated);
                if (!updated) {
                    return res.status(constant_1.HTTP_STATUS.BAD_REQUEST).json({ message: "Failed to reset password" });
                }
                res.status(constant_1.HTTP_STATUS.OK).json({ message: "Password reset successfully" });
            }
            catch (error) {
                res.status(error.status || 500).json({ message: error.message });
            }
        });
    }
    findUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (!userId) {
                    return res.status(400).json({ message: "userId is required in route params" });
                }
                const userData = yield this._authService.findByIdWithProfile(userId);
                if (!userData) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json({ message: "Data retrieved", userData });
            }
            catch (error) {
                res.status(error.status || 500).json({ message: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
