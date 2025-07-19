"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
// userRoutes.ts
const express_1 = require("express");
const userAuthMiddleware_1 = require("../middlewares/userAuthMiddleware");
const userSettingInjection_1 = require("../di/userSettingInjection"); // Your DI-based controller injection
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/:userId", userSettingInjection_1.injectedUserController.getUserProfile.bind(userSettingInjection_1.injectedUserController));
        this.router.put("/:userId", userSettingInjection_1.injectedUserController.updateUserProfile.bind(userSettingInjection_1.injectedUserController));
        this.router.put("/:userId/preferences", userSettingInjection_1.injectedUserController.updatePreferences.bind(userSettingInjection_1.injectedUserController));
        this.router.post("/change-password", userAuthMiddleware_1.userAuthMiddleware, (req, res) => userSettingInjection_1.injectedUserController.changePassword.bind(userSettingInjection_1.injectedUserController)(req, res));
    }
}
exports.UserRoutes = UserRoutes;
