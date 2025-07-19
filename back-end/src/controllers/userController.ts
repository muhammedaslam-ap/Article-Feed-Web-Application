// userController.ts
import { Request, Response } from "express";
import { IUserService } from "../interfaces/serviceInterfaces/userServiceInterface";
import { CustomRequest } from "../middlewares/userAuthMiddleware";
import { HTTP_STATUS } from "../shared/constant";
import { CustomError } from "../util/custom.error";

export class UserController {
  constructor(private userService: IUserService) {}

  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const user = await this.userService.getUserProfile(userId);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
      }
      res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const updated = await this.userService.updateUserProfile(userId, req.body);
      res.status(HTTP_STATUS.OK).json(updated);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updatePreferences(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const updated = await this.userService.updateUserPreferences(userId, req.body);
      res.status(HTTP_STATUS.OK).json(updated);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async changePassword(req: CustomRequest, res: Response) {
    try {
      const userId = req.user.id;
      await this.userService.changePassword(userId, req.body);
      res.status(HTTP_STATUS.OK).json({ message: "Password updated successfully" });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
