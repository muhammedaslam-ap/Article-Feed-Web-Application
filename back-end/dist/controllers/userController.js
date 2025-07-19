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
exports.UserController = void 0;
const constant_1 = require("../shared/constant");
const custom_error_1 = require("../util/custom.error");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield this.userService.getUserProfile(userId);
                if (!user) {
                    return res.status(constant_1.HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
                }
                res.status(constant_1.HTTP_STATUS.OK).json(user);
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    updateUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const updated = yield this.userService.updateUserProfile(userId, req.body);
                res.status(constant_1.HTTP_STATUS.OK).json(updated);
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    updatePreferences(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const updated = yield this.userService.updateUserPreferences(userId, req.body);
                res.status(constant_1.HTTP_STATUS.OK).json(updated);
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                yield this.userService.changePassword(userId, req.body);
                res.status(constant_1.HTTP_STATUS.OK).json({ message: "Password updated successfully" });
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    handleError(error, res) {
        if (error instanceof custom_error_1.CustomError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.UserController = UserController;
