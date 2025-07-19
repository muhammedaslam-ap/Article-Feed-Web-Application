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
exports.UserRepository = void 0;
const mongoose_1 = require("mongoose");
const baseRepository_1 = require("./baseRepository");
const userModel_1 = require("../models/userModel");
const bcrypt_1 = require("../util/bcrypt");
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(userModel_1.UserModel);
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let saved = yield this.create(data);
            console.log("im here", saved);
            return saved;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email });
        });
    }
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch user with password field explicitly
                const user = yield this.model.findOne({ _id: data.user }).select("+password");
                if (!user) {
                    throw new Error("User not found");
                }
                console.log("Current user password (before):", user.password); // Debug current password
                // Verify current password
                const isMatch = yield (0, bcrypt_1.comparePassword)(data.currentPassword, user.password);
                console.log("Current password match check:", isMatch); // Debug match
                if (!isMatch) {
                    throw new Error("Current password is not matching");
                }
                const updated = yield this.model.findOneAndUpdate({ _id: data.user }, { password: data.newPassword }, { new: true, runValidators: true });
                if (!updated) {
                    throw new Error("Failed to update password");
                }
                console.log("Password updated (document):", updated); // Debug updated document
                // Verify the update
                const verifiedUser = yield this.model.findById(data.user).select("+password");
                console.log("Verified user password (after):", verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.password); // Debug final password
                return !!updated;
            }
            catch (error) {
                console.error("Reset password error:", error);
                throw error;
            }
        });
    }
    updatePassword(id, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.model.findByIdAndUpdate(id, { password: newPassword }, { new: true });
            return !!updated;
        });
    }
    findByIdWithProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id))
                return null;
            const user = yield this.model.findById(id).lean();
            return user || null;
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findByIdAndUpdate(id, { isBlocked: status });
        });
    }
}
exports.UserRepository = UserRepository;
