import express from "express";
import { postSignup } from "../controllers/signup.controller.js";
import { postLogin } from "../controllers/login.controller.js";
import { postLogout } from "../controllers/logout.controller.js";
import { getUserInfo } from "../controllers/user.controller.js";
import { patchUserInfo } from "../controllers/user-edit.controller.js";

const router = express.Router();

// POST /v1/auth/signup - 회원가입
router.post("/auth/signup", postSignup);

// POST /v1/auth/login - 로그인
router.post("/auth/login", postLogin);

// POST /v1/auth/logout - 로그아웃
router.post("/auth/logout", postLogout);

// GET /v1/user/me - 정보 조회
router.get("/users/me", getUserInfo);

// PATCH /v1/user - 정보 수정
router.patch("/users", patchUserInfo);

export default router;
