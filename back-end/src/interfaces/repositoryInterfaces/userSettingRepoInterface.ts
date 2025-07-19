import {
  TUpdateUserProfileInput,
  TUpdateUserPreferencesInput,
  TUserWithProfile,
} from "../../types/user";

export interface IUserRepository {
  getUserProfileById(userId: string): Promise<TUserWithProfile | null>;
  updateUserProfile(userId: string, data: TUpdateUserProfileInput): Promise<TUserWithProfile | null>;
  updatePreferences(userId: string, data: TUpdateUserPreferencesInput): Promise<TUserWithProfile | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<boolean>;
}
