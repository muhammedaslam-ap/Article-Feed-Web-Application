"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadPath = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
}
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, uploadPath);
        },
        filename: function (_req, file, cb) {
            const ext = path_1.default.extname(file.originalname);
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        },
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (_req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "video/mp4",
            "video/avi",
            "video/quicktime",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only PDF, JPG, PNG, and video files (MP4, AVI, MOV) are allowed"));
        }
        cb(null, true);
    },
});
