import express from "express";
const router = express.Router()
import authMiddleware from "../middlewares/authMiddleware.js";
import { getTrainTickets,createTrainTicket,updateTrainTicket,deleteTrainTicket,downloadTrainTicket,previewTrainTicket} from "../controllers/trainTicketController.js";


router.get("/", authMiddleware, getTrainTickets);
router.post("/", authMiddleware, createTrainTicket);
router.put("/:id", authMiddleware, updateTrainTicket);
router.delete("/:id", authMiddleware, deleteTrainTicket);
router.get("/:id/download", authMiddleware, downloadTrainTicket);

// Preview is public
router.post("/preview", previewTrainTicket);



export default router;
