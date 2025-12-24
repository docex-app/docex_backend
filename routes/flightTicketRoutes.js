import express from "express";
const router = express.Router()

import { getFlightTickets,createFlightTicket,updateFlightTicket,deleteFlightTicket,previewFlightTicket,downloadFlightTicket } from "../controllers/flightTicketController.js";


router.get("/", getFlightTickets)
router.post("/",createFlightTicket)
router.put("/:id", updateFlightTicket)
router.delete("/:id", deleteFlightTicket)
router.post("/preview", previewFlightTicket);
router.get("/:id/download", downloadFlightTicket);

export default router;
