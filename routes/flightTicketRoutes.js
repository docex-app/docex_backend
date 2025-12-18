import express from "express";
const router = express.Router()

import { getFlightTickets,createFlightTicket,updateFlightTicket,deleteFlightTicket } from "../controllers/flightTicketController.js";


router.get("/", getFlightTickets)
router.post("/",createFlightTicket)
router.put("/:id", updateFlightTicket)
router.delete("/:id", deleteFlightTicket)

export default router;
