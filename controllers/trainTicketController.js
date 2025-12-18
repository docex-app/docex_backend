import TrainTicket from "../model/trainTicketModel.js";
import generatePDF from "../services/pdf/pdfService.js";
import trainTicketTemplate from "../services/pdf/templates/trainTicket.template.js";


const getTrainTickets = async (req,res)=>{
    try{
        const allTrainTickets = await TrainTicket.find()

        if(!allTrainTickets || allTrainTickets.length===0){
            return res.status(404).json({
                success : false,
                message : "No Train Tickets found !"
            })
        }

        res.status(200).json({
            success : true,
            trainTicket : allTrainTickets
        })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}

//CREATE

const createTrainTicket = async (req,res)=>{
    try{
        const {paxName, sourceStation,destStation,numOfPax,farePerPax,travelDate,trainNum,pnr} = req.body;
         if (!paxName || !sourceStation || !destStation || !numOfPax || !farePerPax || !travelDate || !trainNum || !pnr) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const newTrainTicket = new TrainTicket({paxName, sourceStation,destStation,numOfPax,farePerPax,travelDate,trainNum,pnr})
        await newTrainTicket.save();


        res.status(201).json({
            success : true,
            message : "Train Ticket Created Successfully",
            trainTicket : newTrainTicket
        })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }

}


//UPDATE

const updateTrainTicket = async (req,res)=>{
    try{
        const {id} = req.params;
        const {paxName, sourceStation,destStation,numOfPax,farePerPax,travelDate,trainNum,pnr} = req.body;
        const updatedTrainTicket = await TrainTicket.findByIdAndUpdate(id,{
            paxName, sourceStation,destStation,numOfPax,farePerPax,travelDate,trainNum,pnr
        }, {new:true})

        if(!updatedTrainTicket){
           return res.status(404).json({
                success : false,
                message : "Cannot find Train Ticket"
            })
        }

        res.status(200).json({
            success : true,
            trainTicket : updatedTrainTicket
        })



    }catch(err){

        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}

//DELETE
const deleteTrainTicket = async (req,res)=>{
    try{
        const {id} = req.params;
        const deletedTrainTicket = await TrainTicket.findByIdAndDelete(id);
        
        if(!deletedTrainTicket){
         return res.status(404).json({
            success : false,
            message : "Train Ticket not found for deletion"
        })
    }

    res.status(200).json({
        success : true,
        message : "Train Ticket has been deleted Successfully"
    })

    }catch(err){
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message
        })
    }
}


//DOWNLOAD PDF

const downloadTrainTicket = async (req, res) => {
  try {
    const html = trainTicketTemplate(req.body);
    const { buffer, fileName } = await generatePDF(html, "train-ticket.pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${fileName}`
    });

    res.send(buffer);

  } catch (err) {
    res.status(500).json({ message: "PDF generation failed" });
  }
};

//PREVIEW
const previewTrainTicket = async (req, res) => {
  try {
    const html = trainTicketTemplate(req.body);

    res.setHeader("Content-Type", "text/html");
    return res.send(html);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Preview failed",
      error: err.message
    });
  }
};


export {getTrainTickets,updateTrainTicket,createTrainTicket,deleteTrainTicket,downloadTrainTicket,previewTrainTicket}