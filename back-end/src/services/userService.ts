// services/userService.ts

import { IUserService } from "../interfaces/serviceInterfaces/userServiceInterface";
import { IUserRepository } from "../interfaces/repositoryInterfaces/userSettingRepoInterface";
import {
  TUpdateUserProfileInput,
  TUpdateUserPreferencesInput,
  TUserWithProfile,
  TChangePasswordInput,
} from "../types/user";
import { hashPassword } from "../util/bcrypt";
import { CustomError } from "../util/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constant";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getUserProfile(userId: string): Promise<TUserWithProfile> {
    const user = await this.userRepository.getUserProfileById(userId);
    if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    return user;
  }

  async updateUserProfile(userId: string, data: TUpdateUserProfileInput): Promise<TUserWithProfile> {
    const updated = await this.userRepository.updateUserProfile(userId, data);
    if (!updated) throw new CustomError("Failed to update profile", HTTP_STATUS.BAD_REQUEST);
    return updated;
  }

  async updateUserPreferences(userId: string, data: TUpdateUserPreferencesInput): Promise<TUserWithProfile> {
    const updated = await this.userRepository.updatePreferences(userId, data);
    if (!updated) throw new CustomError("Failed to update preferences", HTTP_STATUS.BAD_REQUEST);
    return updated;
  }

 async changePassword(userId: string, data: TChangePasswordInput): Promise<{ message: string }> {
  const hashed = await hashPassword(data.newPassword);
  const success = await this.userRepository.updatePassword(userId, hashed);

  if (!success) {
    throw new CustomError("Failed to change password", HTTP_STATUS.BAD_REQUEST);
  }

  return { message: "Password changed successfully" };
}
}
