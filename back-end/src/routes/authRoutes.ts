import { validateDTO } from "../middlewares/validateDTO";
import { registerSchema } from "../validation/userValidation";
import { injectedAuthController,
} from "../di/authInjection";
import { Request, Response, Router } from "express";
import { resetPasswordSchema } from "../validation/passwordValidation";
import { injectedRefreshTokenController } from "../di/userInjection";

export class authRoutes{
    public router : Router
    constructor(){
        this.router = Router();
        this.initializeRoutes()
    }

    initializeRoutes(){
        this.router.post
        ('/register/user',validateDTO(registerSchema),
        (req:Request,res:Response)=>
            injectedAuthController.registerUser(req, res)
    );

    this.router.post("/login", (req: Request, res: Response) =>
        injectedAuthController.loginUser(req, res)
     );

     this.router.post("/logout", (req: Request, res: Response) =>
        injectedAuthController.logoutUser(req, res)
     );

    this.router.post("/refresh-token", (req: Request, res: Response) =>
        injectedRefreshTokenController.handle(req, res)
      );

      this.router.post("/verifyEmail", async (req: Request, res: Response) => {
        try {
            await injectedAuthController.forgotPassword(req, res);
        } catch (error) {
            res.status(500).json({ error: "An error occurred while processing forgot password." });
        }
    });
    this.router.post("/verify-otp", async (req: Request, res: Response) => {
        try {
            await injectedAuthController.verifyOtp(req, res);
        } catch (error) {
            res.status(500).json({ error: "An error occurred while verifying OTP." });
        }
    });


    this.router.post("/reset-password", async (req: Request, res: Response) => {
        try {
            await injectedAuthController.resetPassword(req, res);
        } catch (error) {
            res.status(500).json({ error: "An error occurred while resetting the password." });
        }
    });


        this.router.get("/me/:userId", async (req: Request, res: Response) => {
        try {
            console.log("📦 User data fetched 1")
            await injectedAuthController.findUserById(req, res);
        } catch (error) {
            res.status(500).json({ error: "An error occurred while checking tutor" });
        }
    });  
}
}