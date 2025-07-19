import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB";
import { handleError } from "./middlewares/errorHandingMiddleware";
import { CustomError } from "./util/custom.error";

import morgan from "morgan";
import { OtpRoutes } from "./routes/otpRoutes";
import { createServer } from "http";
import { authRoutes } from "./routes/authRoutes";
import { ArticleRoutes } from "./routes/articleRoutes";
import { UserRoutes } from "./routes/userRoute";
import path from "path";

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const corsOptions = {
  origin: [process.env.FRONTEND_URL || "http://localhost:5173"], 
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

const app: Express = express();
const httpServer = createServer(app);


app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

try {  
  app.use("/auth", new authRoutes().router);
  app.use("/otp", new OtpRoutes().router);
  app.use("/", new ArticleRoutes().router);
  app.use("/users", new UserRoutes().router);
  


} catch (error) {
  console.error("Error initializing routes:", error);
  process.exit(1);
}

app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error in ${req.method} ${req.url}:`, error);
  handleError(error, req, res, next);
});

export { app, httpServer };