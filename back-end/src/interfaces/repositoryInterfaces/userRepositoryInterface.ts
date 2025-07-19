import {
  TUpdatePassword,
  TUserModel,
  TUserRegister,
  TUserWithProfile,
} from "../../types/user";

export interface IUserRepository {
  createUser(data: TUserRegister): Promise<TUserModel>;
  findByEmail(email: string): Promise<TUserModel | null>;
  findById(id: string): Promise<TUserModel | null>;
  resetPassword(data: TUpdatePassword): Promise<boolean>;
  updatePassword(id: string, newPassword: string): Promise<boolean>;
  updateStatus(id: string, status: boolean): Promise<void>;
  findByIdWithProfile(id: string): Promise<TUserWithProfile | null>;
}
