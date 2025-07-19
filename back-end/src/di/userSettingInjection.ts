
import { UserRepository } from "../repository/userSettingRepository";
import { UserService } from "../services/userService";
import { UserController } from "../controllers/userController";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
export const injectedUserController = new UserController(userService);
