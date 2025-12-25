import mongoose from "mongoose";
import baseTicketFields from "./baseTicketFieldModel.js";

const TrainTicketSchema = new mongoose.Schema({

    user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
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
        required : true,
    },
    pdfPath:{
        type : String
    }
    
}, { timestamps: true, versionKey:false }
)

const TrainTicket = mongoose.model("TrainTicket", TrainTicketSchema)

export default TrainTicket;