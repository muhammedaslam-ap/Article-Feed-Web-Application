import { OtpController } from "../controllers/otpController";
import { OtpRepository } from "../repository/otpRepository";
import { UserRepository } from "../repository/userRepository";
import { OtpService } from "../services/otp/otpServices"

const otpRepository = new OtpRepository();
const userRepository  = new UserRepository()
const otpService = new OtpService(otpRepository,userRepository);

export const injectedOtpController = new OtpController(otpService);
