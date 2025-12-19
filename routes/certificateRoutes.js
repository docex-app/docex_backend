import express from "express";
const router = express.Router();
// import { createCertificate, getCertificates, updateCertificate,deleteCertificate,downloadCertificate,previewCertificate} from "../controllers/certificatesController.js";
import { createCertificate,getCertificates,updateCertificate,deleteCertificate,downloadCertificate,previewCertificate } from "../controllers/certificatesController.js";

router.get("/", getCertificates)
router.post("/", createCertificate)
router.put("/:id", updateCertificate)
router.delete("/:id", deleteCertificate)
// router.get("/:id/preview", previewCertificate);
router.get("/:id/download", downloadCertificate);
router.post("/preview", previewCertificate);   // PREVIEW ONLY



export default router;