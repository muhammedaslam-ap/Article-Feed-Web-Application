import { Document, Types } from "mongoose";

/** ========== DTO TYPES ========== */

// ✅ Used during registration
export type TUserRegister = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  password?: string;
  preferences: string[];
};

// ✅ Used during login
export type TUserLogin = {
  email: string;
  password: string;
};

// ✅ Used to verify OTP
export type TOtpVerify = {
  email: string;
  otp: number;
};

// ✅ Used for requesting OTP
export type TEmail = {
  email: string;
};

// ✅ Used when resetting password via OTP
export type TUpdatePassword = {
  currentPassword?:string;
  user?: string;
  newPassword: string;
};

// ✅ Used when changing password from profile
export type TChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

// ✅ Used when updating profile from frontend
export type TUpdateUserProfileInput = {
  firstName?: string;
  lastName?: string;
  dob?: string; // ISO string from frontend
  phone?: string;
};

// ✅ Used when updating preferences
export type TUpdateUserPreferencesInput = {
  preferences: string[];
};

/** ========== DATABASE TYPES ========== */

// ✅ Base user document in Mongoose
export interface IUser extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  password: string;
  preferences: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TUserModel = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  password: string;
  preferences: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUserCreateInput = Omit<TUserModel, "_id" | "createdAt" | "updatedAt">;

export interface TUserDocument extends TUserModel, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

type TUserProfileFields = {
  education?: string;
  aboutMe?: string;
  interests?: string;
};

export type TUserWithProfile = TUserModel & TUserProfileFields;

export type TStudent = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  course: string;
  purchaseDate: Date;
  amount: number;
};
