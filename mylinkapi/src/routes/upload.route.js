import express from "express";
import { upload, uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

// POST /v1/uploads
router.post("/uploads", upload, uploadImage);

export default router;
