import mongoose from "mongoose";
import baseTicketFields from "./baseTicketFieldModel.js";

const FlightTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // shared fields
    ...baseTicketFields,

    sourceAirport: {
      type: String,
      required: true,
    },

    destAirport: {
      type: String,
      required: true,
    },

    flightNumber: {
      type: String,
      required: true,
    },

    seatNumber: {
      type: String,
    },

    pdfPath: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const FlightTicket = mongoose.model("FlightTicket", FlightTicketSchema);
export default FlightTicket;
