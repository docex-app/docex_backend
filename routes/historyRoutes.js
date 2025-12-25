import express from "express";
import { getUserHistory } from "../controllers/historyController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================
   USER HISTORY
========================= */
router.get("/", authMiddleware, getUserHistory);

export default router;
