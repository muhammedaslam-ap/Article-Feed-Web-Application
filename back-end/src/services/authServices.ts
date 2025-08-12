import { ITokenService } from "../interfaces/serviceInterfaces/jwtTokenInterface";
import { IUserRepository } from "../interfaces/repositoryInterfaces/userRepositoryInterface";
import { IAuthService } from "../interfaces/serviceInterfaces/authServiceInterface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constant";
import { TVerifyOtpToRegister } from "../types/otp";
import {
  TUpdatePassword,
  TUserLogin,
  TUserModel,
  TUserRegister,
  TUserWithProfile,
} from "../types/user";
import { comparePassword, hashPassword } from "../util/bcrypt";
import { CustomError } from "../util/custom.error";
import { IOtpService } from "../interfaces/serviceInterfaces/otpServiceInterface";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _otpService: IOtpService,
    private _jwtService: ITokenService
  ) {}

  async registerUser(data: TUserRegister): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const hashedPassword = data.password ? await hashPassword(data.password) : "";

    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      password: hashedPassword,
      preferences: data.preferences || [],
    };
    

     await this._userRepository.createUser(newUser);

  }

  async loginUser(data: TUserLogin): Promise<{ user: TUserModel; accessToken: string; refreshToken: string }> {
    const user = await this._userRepository.findByEmail(data.email);

    if (!user) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_NOT_FOUND, HTTP_STATUS.UNAUTHORIZED);
    }

    if (user.password) {
      const isMatch = await comparePassword(data.password, user.password);
      console.log("suii",data.password , user.password,isMatch)
      if (!isMatch) {
        console.log("helllo")
        throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED);
      }
    }

    const accessToken = this._jwtService.generateAccessToken({
      id: user._id!.toString(),
      email: user.email,
      role: "user", 
    });

    const refreshToken = this._jwtService.generateRefreshToken({
      id: user._id!.toString(),
      email: user.email,
      role: "user", 
    });

    return { user, accessToken, refreshToken };
  }

  async verifyPassword(id: string, password: string): Promise<boolean> {
    const user = await this._userRepository.findById(id);
    if (!user) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.UNAUTHORIZED);
    }

    if (user.password) {
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, HTTP_STATUS.UNAUTHORIZED);
      }
      return true;
    }

    return false;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await this._otpService.otpGenerate({
      email,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    });
  }

  async verifyResetOtp(data: TVerifyOtpToRegister): Promise<boolean> {
    return await this._otpService.verifyOtp({
      email: data.email,
      otp: Number(data.otp),
    });
  }

  async resetPassword(data: TUpdatePassword): Promise<boolean> {
    data.newPassword = await hashPassword(data.newPassword);
    console.log("hlololo")
    return await this._userRepository.resetPassword(data);
  }

  async verifyEmail(email: string): Promise<TUserModel | null> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return user;
  }

  async findByIdWithProfile(id: string): Promise<TUserWithProfile | null> {
    return this._userRepository.findByIdWithProfile(id);
  }
}