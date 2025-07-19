import { Types } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { UserModel } from "../models/userModel";
import {
  TUserRegister,
  TUserDocument,
  TUserModel,
  TUpdatePassword,
} from "../types/user";
import { IUserRepository } from "../interfaces/repositoryInterfaces/userRepositoryInterface";
import { comparePassword, hashPassword } from "../util/bcrypt";
import bcrypt from 'bcrypt';

export class UserRepository
  extends BaseRepository<TUserDocument, TUserRegister>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async createUser(data: TUserRegister): Promise<TUserDocument> {
    let saved =  await this.create(data);
    console.log("im here",saved)
    return saved
  }

  async findByEmail(email: string): Promise<TUserDocument | null> {
    return await this.model.findOne({ email });
  }

async resetPassword(data: TUpdatePassword): Promise<boolean> {
  try {
    // Fetch user with password field explicitly
    const user = await this.model.findOne({ _id: data.user }).select("+password");
    if (!user) {
      throw new Error("User not found");
    }

    console.log("Current user password (before):", user.password); // Debug current password

    // Verify current password
    const isMatch = await comparePassword(data.currentPassword!, user.password);
    console.log("Current password match check:", isMatch); // Debug match
    if (!isMatch) {
      throw new Error("Current password is not matching");
    }
    const updated = await this.model.findOneAndUpdate(
      { _id: data.user },
      { password: data.newPassword },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error("Failed to update password");
    }

    console.log("Password updated (document):", updated); // Debug updated document

    // Verify the update
    const verifiedUser = await this.model.findById(data.user).select("+password");
    console.log("Verified user password (after):", verifiedUser?.password); // Debug final password

    return !!updated;
  } catch (error: any) {
    console.error("Reset password error:", error);
    throw error;
  }
}

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const updated = await this.model.findByIdAndUpdate(
      id,
      { password: newPassword },
      { new: true }
    );
    return !!updated;
  }

  async findByIdWithProfile(id: string): Promise<TUserModel | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const user = await this.model.findById(id).lean();
    return user || null;
  }

  async updateStatus(id: string, status: boolean): Promise<void> {
    await this.model.findByIdAndUpdate(id, { isBlocked: status });
  }
}