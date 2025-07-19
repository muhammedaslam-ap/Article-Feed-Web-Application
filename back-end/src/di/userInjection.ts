import { RefreshTokenController } from "../controllers/refreshTokenController";
import { JwtService } from "../services/jwt/jwt";
import { RefreshTokenService } from "../services/refreshTockenService";
import { UserRepository } from "../repository/userRepository";

const userRepository = new UserRepository()
const tokenService = new JwtService();


const refreshTokenService = new RefreshTokenService(tokenService);


export const injectedRefreshTokenController = new RefreshTokenController(
  refreshTokenService
);


