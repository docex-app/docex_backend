import mongoose from "mongoose";
import baseTicketFields from "./baseTicketFieldModel.js";

const TrainTicketSchema = new mongoose.Schema({
   ...baseTicketFields,
    sourceStation:{
        type:String,
        required : true
    },
    destStation:{
        type:String,
        required : true
    },
    trainNum:{
        type : Number,
        require : true,
    },
    
}, { timestamps: true }
)

const TrainTicket = mongoose.model("TrainTicket", TrainTicketSchema)

export default TrainTicket;