import { TOtp, TVerifyOtpToRegister } from "../../types/otp";
import { TUserModel } from "../../types/user";

export interface IOtpService {
  otpGenerate(data: Omit<TOtp, "otp">): Promise<void>;
  verifyOtp(data: TVerifyOtpToRegister): Promise<boolean>;
  checkExistingUser(email: string): Promise<TUserModel | null>;
}
