import express from "express";
import { createLink } from "../controllers/link-add.controller.js";
import { getAllLinks } from "../controllers/link-list.controller.js";

const router = express.Router();

// POST /v1/links - 링크 추가
router.post("/links", createLink);

// GET /v1/links - 모든 링크 조회
router.get("/links", getAllLinks);

export default router;
