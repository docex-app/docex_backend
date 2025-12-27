import express from "express";
import { sendSignupEmail,sendCertificateEmail,sendTrainTicketEmail, sendFlightTicketEmail,resendDocumentEmail,sendInvoiceEmail } from "../controllers/emailController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/signup", sendSignupEmail);
router.post("/certificate", sendCertificateEmail);
router.post("/trainTicket", sendTrainTicketEmail);
router.post("/flightTicket", sendFlightTicketEmail)
router.post("/invoice", authMiddleware, sendInvoiceEmail);

router.post("/resend", authMiddleware, resendDocumentEmail);


export default router;
