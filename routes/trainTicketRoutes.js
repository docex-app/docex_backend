import express from "express";
const router = express.Router()

import { getTrainTickets,createTrainTicket,updateTrainTicket,deleteTrainTicket,downloadTrainTicket,previewTrainTicket } from "../controllers/trainTicketController.js";


router.get("/", getTrainTickets)
router.post("/", createTrainTicket)
router.put("/:id", updateTrainTicket)
router.delete("/:id", deleteTrainTicket)
router.post("/download", downloadTrainTicket)
router.post("/preview", previewTrainTicket);


export default router;
