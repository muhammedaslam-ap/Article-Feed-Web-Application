"use strict";
// services/userService.ts
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
exports.UserService = void 0;
const bcrypt_1 = require("../util/bcrypt");
const custom_error_1 = require("../util/custom.error");
const constant_1 = require("../shared/constant");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getUserProfileById(userId);
            if (!user)
                throw new custom_error_1.CustomError(constant_1.ERROR_MESSAGES.USER_NOT_FOUND, constant_1.HTTP_STATUS.NOT_FOUND);
            return user;
        });
    }
    updateUserProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.userRepository.updateUserProfile(userId, data);
            if (!updated)
                throw new custom_error_1.CustomError("Failed to update profile", constant_1.HTTP_STATUS.BAD_REQUEST);
            return updated;
        });
    }
    updateUserPreferences(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.userRepository.updatePreferences(userId, data);
            if (!updated)
                throw new custom_error_1.CustomError("Failed to update preferences", constant_1.HTTP_STATUS.BAD_REQUEST);
            return updated;
        });
    }
    changePassword(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashed = yield (0, bcrypt_1.hashPassword)(data.newPassword);
            const success = yield this.userRepository.updatePassword(userId, hashed);
            if (!success) {
                throw new custom_error_1.CustomError("Failed to change password", constant_1.HTTP_STATUS.BAD_REQUEST);
            }
            return { message: "Password changed successfully" };
        });
    }
}
exports.UserService = UserService;
