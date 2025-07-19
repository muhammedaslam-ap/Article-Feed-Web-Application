"use strict";
// repository/userRepository.ts
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
const userModel_1 = require("../models/userModel");
class UserRepository {
    getUserProfileById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.UserModel.findById(userId)
                .lean()
                .exec();
        });
    }
    updateUserProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.UserModel.updateOne({ _id: userId }, { $set: data }).exec();
            return yield this.getUserProfileById(userId);
        });
    }
    updatePreferences(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.UserModel.updateOne({ _id: userId }, { $set: { preferences: data.preferences } }).exec();
            return yield this.getUserProfileById(userId);
        });
    }
    updatePassword(userId, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield userModel_1.UserModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
            return result.modifiedCount > 0;
        });
    }
}
exports.UserRepository = UserRepository;
