import mongoose from "mongoose";
import baseTicketFields from "./baseTicketFieldModel.js";

const FlightTicketSchema = new mongoose.Schema({
   ...baseTicketFields,
     sourceAirport: 
     { 
        type: String, 
        required: true 
    },
    destAirport: 
    {   type: String, 
        required: true 
    },
    flightNumber: 
    { type: String, 
     required: true 
    },
    seatNumber: String

}, 
{ timestamps: true , 
 versionKey: false }
)

const FlightTicket = mongoose.model("FlightTicket", FlightTicketSchema)

export default FlightTicket;