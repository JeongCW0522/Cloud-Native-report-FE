import express from "express";
import { postSignup } from "../controllers/signup.controller.js";

const router = express.Router();

// POST /v1/links - 링크 추가
router.post("/auth/signup", postSignup);

export default router;
