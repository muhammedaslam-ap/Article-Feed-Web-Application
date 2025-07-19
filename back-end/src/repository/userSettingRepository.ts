// repository/userRepository.ts

import { IUserRepository } from "../interfaces/repositoryInterfaces/userSettingRepoInterface";
import { UserModel } from "../models/userModel";
import {
  TUpdateUserProfileInput,
  TUpdateUserPreferencesInput,
  TUserWithProfile,
} from "../types/user";

export class UserRepository implements IUserRepository {
  async getUserProfileById(userId: string): Promise<TUserWithProfile | null> {
    return await UserModel.findById(userId)
      .lean<TUserWithProfile>()
      .exec();
  }

  async updateUserProfile(
    userId: string,
    data: TUpdateUserProfileInput
  ): Promise<TUserWithProfile | null> {
    await UserModel.updateOne({ _id: userId }, { $set: data }).exec();
    return await this.getUserProfileById(userId);
  }

  async updatePreferences(
    userId: string,
    data: TUpdateUserPreferencesInput
  ): Promise<TUserWithProfile | null> {
    await UserModel.updateOne({ _id: userId }, { $set: { preferences: data.preferences } }).exec();
    return await this.getUserProfileById(userId);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<boolean> {
    const result = await UserModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
    return result.modifiedCount > 0;
  }
}
