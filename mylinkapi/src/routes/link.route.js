import express from "express";
import { createLink } from "../controllers/link-add.controller.js";
import { getAllLinks } from "../controllers/link-list.controller.js";
import { getLinkDetail } from "../controllers/link-detail.controller.js";
import { deleteLink } from "../controllers/lint-delete.controller.js";
import { updateLink } from "../controllers/link-edit.controller.js";

const router = express.Router();

// POST /v1/links - 링크 추가
router.post("/links", createLink);

// GET /v1/links - 모든 링크 조회
router.get("/links", getAllLinks);

// GET /v1/links/:id - 링크 상세 조회
router.get("/links/:id", getLinkDetail);

// PUT /v1/links/:id - 링크 수정
router.patch("/links/:id", updateLink);

// DELETE /v1/links/:id - 링크 삭제
router.delete("/links/:id", deleteLink);

export default router;
