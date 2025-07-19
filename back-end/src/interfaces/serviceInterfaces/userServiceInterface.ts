import {
  TUpdateUserProfileInput,
  TUpdateUserPreferencesInput,
  TChangePasswordInput,
  TUserWithProfile,
} from "../../types/user";

export interface IUserService {
  getUserProfile(userId: string): Promise<TUserWithProfile>;
  updateUserProfile(userId: string, data: TUpdateUserProfileInput): Promise<TUserWithProfile>;
  updateUserPreferences(userId: string, data: TUpdateUserPreferencesInput): Promise<TUserWithProfile>;
  changePassword(userId: string, data: TChangePasswordInput): Promise<{ message: string }>;
}
