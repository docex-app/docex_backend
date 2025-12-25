import express from "express";
const router = express.Router();
import  authMiddleware from "../middlewares/authMiddleware.js"

// import { createCertificate, getCertificates, updateCertificate,deleteCertificate,downloadCertificate,previewCertificate} from "../controllers/certificatesController.js";
import { createCertificate,getCertificates,updateCertificate,deleteCertificate,downloadCertificate,previewCertificate } from "../controllers/certificatesController.js";

router.get("/", authMiddleware,getCertificates)
router.post("/", authMiddleware, createCertificate)
router.put("/:id", authMiddleware, updateCertificate)
router.delete("/:id",authMiddleware, deleteCertificate)
// router.get("/:id/preview", previewCertificate);
router.get("/:id/download", authMiddleware, downloadCertificate);
router.post("/preview", previewCertificate);   // PREVIEW ONLY



export default router;