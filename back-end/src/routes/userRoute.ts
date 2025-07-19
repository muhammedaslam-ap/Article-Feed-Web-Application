// userRoutes.ts
import { Router } from "express";
import { CustomRequest, userAuthMiddleware } from "../middlewares/userAuthMiddleware";
import { injectedUserController } from "../di/userSettingInjection"; // Your DI-based controller injection

export class UserRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/:userId", injectedUserController.getUserProfile.bind(injectedUserController));
    this.router.put("/:userId", injectedUserController.updateUserProfile.bind(injectedUserController));
    this.router.put("/:userId/preferences", injectedUserController.updatePreferences.bind(injectedUserController));
this.router.post(
  "/change-password",
  userAuthMiddleware,
  (req, res) => injectedUserController.changePassword.bind(injectedUserController)(req as CustomRequest, res)
);
  }
}
