
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
      const ext = path.extname(file.originalname);
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
      return cb(
        new Error(
          "Only PDF, JPG, PNG, and video files (MP4, AVI, MOV) are allowed"
        )
      );
    }

    cb(null, true);
  },
});



