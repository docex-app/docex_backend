import express from "express";
import { sendSignupEmail,sendCertificateEmail,sendTrainTicketEmail, sendFlightTicketEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/signup", sendSignupEmail);
router.post("/certificate", sendCertificateEmail);
router.post("/trainTicket", sendTrainTicketEmail);
router.post("/flightTicket", sendFlightTicketEmail)

export default router;
