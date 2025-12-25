import express from "express";
const router = express.Router()

import { getFlightTickets,createFlightTicket,updateFlightTicket,deleteFlightTicket,previewFlightTicket,downloadFlightTicket } from "../controllers/flightTicketController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
router.get("/", authMiddleware, getFlightTickets);
router.post("/", authMiddleware, createFlightTicket);
router.put("/:id", authMiddleware, updateFlightTicket);
router.delete("/:id", authMiddleware, deleteFlightTicket);
router.get("/:id/download", authMiddleware, downloadFlightTicket);

router.post("/preview", previewFlightTicket);


export default router;
