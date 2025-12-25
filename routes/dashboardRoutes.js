import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getDashboardAnalytics } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/analytics", authMiddleware, getDashboardAnalytics);

export default router;
