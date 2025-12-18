import express from "express";
import { sendSignupEmail,sendCertificateEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/signup", sendSignupEmail);
router.post("/certificate", sendCertificateEmail);


export default router;
