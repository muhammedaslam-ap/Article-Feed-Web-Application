"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary_1 = require("cloudinary");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connectDB_1 = require("./config/connectDB");
const errorHandingMiddleware_1 = require("./middlewares/errorHandingMiddleware");
const morgan_1 = __importDefault(require("morgan"));
const otpRoutes_1 = require("./routes/otpRoutes");
const http_1 = require("http");
const authRoutes_1 = require("./routes/authRoutes");
const articleRoutes_1 = require("./routes/articleRoutes");
const userRoute_1 = require("./routes/userRoute");
const path_1 = __importDefault(require("path"));
(0, connectDB_1.connectDB)();
cloudinary_1.v2.config({
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
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
try {
    app.use("/auth", new authRoutes_1.authRoutes().router);
    app.use("/otp", new otpRoutes_1.OtpRoutes().router);
    app.use("/", new articleRoutes_1.ArticleRoutes().router);
    app.use("/users", new userRoute_1.UserRoutes().router);
}
catch (error) {
    console.error("Error initializing routes:", error);
    process.exit(1);
}
app.use((error, req, res, next) => {
    console.error(`Error in ${req.method} ${req.url}:`, error);
    (0, errorHandingMiddleware_1.handleError)(error, req, res, next);
});
