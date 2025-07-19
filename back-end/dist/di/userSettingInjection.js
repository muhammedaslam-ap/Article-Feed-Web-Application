"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectedUserController = void 0;
const userSettingRepository_1 = require("../repository/userSettingRepository");
const userService_1 = require("../services/userService");
const userController_1 = require("../controllers/userController");
const userRepository = new userSettingRepository_1.UserRepository();
const userService = new userService_1.UserService(userRepository);
exports.injectedUserController = new userController_1.UserController(userService);
