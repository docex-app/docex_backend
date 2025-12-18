import express from "express";
import verifyCertificatePage from "../controllers/verificationController.js";

const router = express.Router();

router.get("/certificate/:verificationId", verifyCertificatePage);

export default router;
