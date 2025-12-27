import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  previewInvoiceFromData,
  createInvoice,
  downloadInvoice,
  deleteInvoice
  
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/preview", authMiddleware, previewInvoiceFromData);
router.post("/", authMiddleware, createInvoice);
router.get("/:id/download", authMiddleware, downloadInvoice);
router.delete("/:id", authMiddleware, deleteInvoice);


export default router;
