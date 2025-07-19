import { Request, Response } from "express";
import { IAuthService } from "../interfaces/serviceInterfaces/authServiceInterface";
import {RegisterDTO, registerSchema } from "../validation/userValidation";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../shared/constant";
import { CustomError } from "../util/custom.error";
import { ITokenService } from "../interfaces/serviceInterfaces/jwtTokenInterface";
import { setAuthCookies } from "../util/cookieHelper";
import { ResetPasswordDTO } from "../validation/passwordValidation";
import { TUserRegister } from "../types/user";
import { z } from "zod";
import { CustomRequest } from "../middlewares/userAuthMiddleware";

export class AuthController {
  constructor(
    private _authService: IAuthService,
    private _jwtService: ITokenService
  ) {}

async registerUser(req: Request, res: Response) {
  try {
    const data = req.body as RegisterDTO; 
    console.log("Controller Data:", data); 
    const savedUser = await this._authService.registerUser(data);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      data: savedUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      });
    }
    if (error instanceof CustomError) {
      console.log("errrrororororro - CustomError:", error.message, error.statusCode);
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
}


  async loginUser(req: Request, res: Response) {
    try {
      const data = req.body;

      const { user, accessToken, refreshToken } = await this._authService.loginUser(data);

      setAuthCookies(res, accessToken, refreshToken, "accessToken", "refreshToken");

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dob: user.dob ,
          preferences: user.preferences
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
        return;
      }
      console.log(error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(200)
        .json({ message: "Logout successful" });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      console.log(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await this._authService.forgotPassword(email);
      res.status(HTTP_STATUS.OK).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      console.log(error);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const isValid = await this._authService.verifyResetOtp({
        email,
        otp: Number(otp),
      });

      if (!isValid) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid or expired OTP" });
      }

      res.status(HTTP_STATUS.OK).json({ message: "OTP verified successfully" });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      // const userId = req.user.id
      const data: ResetPasswordDTO = req.body;
      console.log("suii",data)
      const updated = await this._authService.resetPassword(data);
     console.log("iiiiiiiii",updated)
      if (!updated) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Failed to reset password" });
      }

      res.status(HTTP_STATUS.OK).json({ message: "Password reset successfully" });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async findUserById(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "userId is required in route params" });
      }

      const userData = await this._authService.findByIdWithProfile(userId);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Data retrieved", userData });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}
