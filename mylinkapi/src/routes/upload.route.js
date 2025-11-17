import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

// 메모리 저장소 (req.file.buffer로 sharp 사용)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.toLowerCase().split(".").pop();
    const allowed = ["jpg", "jpeg", "png"];

    if (!ext || !allowed.includes(ext)) {
      return cb(new Error("이미지 파일만 업로드 가능합니다.")); // 필요하면 에러 핸들러에서 처리
    }
    cb(null, true);
  },
});

// === 여기 중요 ===
// POST /v1/uploads  (app.use("/v1", uploadRouter) 기준)
router.post("/uploads", upload.single("file"), uploadImage);

export default router;
