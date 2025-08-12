import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authServices";
import { UserRepository } from "../repository/userRepository";
import { JwtService } from "../services/jwt/jwt";
import { OtpService } from "../services/otp/otpServices";
import { OtpRepository } from "../repository/otpRepository";


const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const otpServices = new OtpService(otpRepository, userRepository);
const jwtService = new JwtService();

const authService = new AuthService(userRepository, otpServices, jwtService);

export const injectedAuthController = new AuthController(authService, jwtService);
