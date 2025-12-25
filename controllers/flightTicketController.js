import mongoose from "mongoose";
import FlightTicket from "../model/flightTicketModel.js";
import flightTicketTemplate from "../services/pdf/templates/flightTicket.template.js";
import generatePDF from "../services/pdf/pdfService.js";

/* ======================================================
   GET MY FLIGHT TICKETS
====================================================== */
const getFlightTickets = async (req, res) => {
  try {
    const tickets = await FlightTicket.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      flightTickets: tickets
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

/* ======================================================
   CREATE FLIGHT TICKET
====================================================== */
const createFlightTicket = async (req, res) => {
  try {
    const {
      paxName,
      numOfPax,
      farePerPax,
      travelDate,
      pnr,
      sourceAirport,
      destAirport,
      flightNumber,
      seatNumber
    } = req.body;

    if (
      !paxName ||
      !numOfPax ||
      !farePerPax ||
      !travelDate ||
      !pnr ||
      !sourceAirport ||
      !destAirport ||
      !flightNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newFlightTicket = await FlightTicket.create({
      user: req.user.id, // 🔑 USER MAPPING
      paxName,
      numOfPax,
      farePerPax,
      travelDate,
      pnr,
      sourceAirport,
      destAirport,
      flightNumber,
      seatNumber
    });

    res.status(201).json({
      success: true,
      message: "Flight Ticket Created Successfully",
      flightTicket: newFlightTicket
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "PNR already exists. Please use a unique PNR."
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

/* ======================================================
   UPDATE FLIGHT TICKET
====================================================== */
const updateFlightTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFlightTicket = await FlightTicket.findOneAndUpdate(
      { _id: id, user: req.user.id }, // 🔒 OWNERSHIP CHECK
      req.body,
      { new: true }
    );

    if (!updatedFlightTicket) {
      return res.status(404).json({
        success: false,
        message: "Cannot find Flight Ticket"
      });
    }

    res.status(200).json({
      success: true,
      flightTicket: updatedFlightTicket
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

/* ======================================================
   DELETE FLIGHT TICKET
====================================================== */
const deleteFlightTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFlightTicket = await FlightTicket.findOneAndDelete({
      _id: id,
      user: req.user.id // 🔒 OWNERSHIP CHECK
    });

    if (!deletedFlightTicket) {
      return res.status(404).json({
        success: false,
        message: "Flight Ticket not found for deletion"
      });
    }

    res.status(200).json({
      success: true,
      message: "Flight Ticket deleted Successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

/* ======================================================
   PREVIEW FLIGHT TICKET (PUBLIC)
====================================================== */
const previewFlightTicket = async (req, res) => {
  try {
    const html = flightTicketTemplate(req.body);
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Preview failed",
      error: err.message
    });
  }
};

/* ======================================================
   DOWNLOAD FLIGHT TICKET (PROTECTED)
====================================================== */
const downloadFlightTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const flightTicket = await FlightTicket.findOne({
      _id: id,
      user: req.user.id // 🔒 OWNERSHIP CHECK
    });

    if (!flightTicket) {
      return res.status(404).json({
        success: false,
        message: "Flight ticket not found"
      });
    }

    const html = flightTicketTemplate(flightTicket);
    const pdfBuffer = await generatePDF(html);

    const safeName = flightTicket.paxName.replace(/\s+/g, "_");
    const fileName = `flightTicket_${safeName}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${fileName}`
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Flight ticket download failed",
      error: err.message
    });
  }
};

export {
  getFlightTickets,
  createFlightTicket,
  updateFlightTicket,
  deleteFlightTicket,
  previewFlightTicket,
  downloadFlightTicket
};


// import FlightTicket from "../model/flightTicketModel.js";
// import flightTicketTemplate from "../services/pdf/templates/flightTicket.template.js";
// import generatePDF from "../services/pdf/pdfService.js";
// import authMiddleware from "../middlewares/authMiddleware.js";
// const getFlightTickets = async (req,res)=>{
//     try{
//         const allFlightTickets = await FlightTicket.find()

//         if(!allFlightTickets || allFlightTickets.length===0){
//             return res.status(404).json({
//                 success : false,
//                 message : "No Flight Tickets found !"
//             })
//         }

//         res.status(200).json({
//             success : true,
//             flightTicket : allFlightTickets
//         })

//     }catch(err){
//         res.status(500).json({
//             success : false,
//             message : "Internal Server Error",
//             error : err.message
//         })
//     }
// }

// //CREATE

// const createFlightTicket = async (req,res)=>{
//     try{
//         const {paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber} = req.body;
//          if (!paxName || !numOfPax || !farePerPax || !travelDate || !pnr || !sourceAirport || !destAirport || !flightNumber) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }
//         const newFlightTicket = new FlightTicket({paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber})
//         await newFlightTicket.save();


//         res.status(201).json({
//             success : true,
//             message : "Flight Ticket Created Successfully",
//             flightTicket : newFlightTicket
//         })

//     }catch(err){

//         console.error("Create flight ticket error:", err);

//   if (err.code === 11000) {
//     return res.status(400).json({
//       success: false,
//       message: "PNR already exists. Please use a unique PNR."
//     });
//   }
//         res.status(500).json({
//             success : false,
//             message : "Internal Server Error",
//             error : err.message
//         })
//     }

// }


// //UPDATE

// const updateFlightTicket = async (req,res)=>{
//     try{
//         const {id} = req.params;
//         const {paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber} = req.body;
//         const updatedFlightTicket = await FlightTicket.findByIdAndUpdate(id,{
//             paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber
//         }, {new:true})

//         if(!updatedFlightTicket){
//            return res.status(404).json({
//                 success : false,
//                 message : "Cannot find Flight Ticket"
//             })
//         }

//           res.status(200).json({
//             success : true,
//             flightTicket : updatedFlightTicket
//         })



//     }catch(err){

//         res.status(500).json({
//             success : false,
//             message : "Internal Server Error",
//             error : err.message
//         })
//     }
// }

// //DELETE
// const deleteFlightTicket = async (req,res)=>{
//     try{
//         const {id} = req.params;
//         const deletedFlightTicket = await FlightTicket.findByIdAndDelete(id);
        
//         if(!deletedFlightTicket){
//          return res.status(404).json({
//             success : false,
//             message : "Flight Ticket not found for deletion"
//         })
//     }

//     res.status(200).json({
//         success : true,
//         message : "Flight Ticket has been deleted Successfully"
//     })

//     }catch(err){
//         res.status(500).json({
//             success : false,
//             message : "Internal Server Error",
//             error : err.message
//         })
//     }
// }

// //PREVIEW FLIGHT TICKETS

// const previewFlightTicket = async (req,res)=>{
//     try{
//         const {paxName,numOfPax,farePerPax,travelDate,pnr,sourceAirport,destAirport,flightNumber,seatNumber} = req.body;

       
//         const verifyURL = "http://localhost:8000/verify/preview";

//         const html = flightTicketTemplate({
//             paxName,
//             numOfPax,
//             farePerPax,
//             pnr,
//             travelDate,
//             sourceAirport,
//             destAirport,
//             flightNumber,
//             seatNumber
//         })

//         res.setHeader("Content-type", "text/html");
//         return res.send(html);




//     }catch(err){
//         res.status(500).json({
//             success : false,
//             message : "Internal Server Error",
//             Error : err.message
//         })
//     }
// }


// const downloadFlightTicket = async (req,res)=>{
//     try{

//         const {id} = req.params;
//         const flightTicket = await FlightTicket.findById(id);
//         if(!flightTicket){
//             return res.status(404).json({
//             success : false,
//             message: "Flight ticket not found"
//         })
//     }

//     //will implement verify later
//         //const verifyURL = "http://localhost:8000/verify/preview";

//         const html = flightTicketTemplate({
//             paxName : flightTicket.paxName,
        
//             numOfPax : flightTicket.numOfPax,
//             farePerPax : flightTicket.farePerPax,
//             pnr : flightTicket.pnr,
//             travelDate : flightTicket.travelDate
//         })

//         const pdfBuffer = await generatePDF(html);

//         const safeName = flightTicket.paxName.replace(/\s+/g, "_");
//         const fileName = `flightTicket_${safeName}.pdf`;

//         res.writeHead(200,{
//             "Content-type" : "application/pdf",
//             "Content-Disposition": `attachment; filename=${fileName}`,
//             "Content-Length": pdfBuffer.length
//         })

//        return res.end(pdfBuffer)



//     }catch(err){
//         console.error("Download error:", err);
//          if (!res.headersSent) {
//       return res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//         error: err.message
//       });
//     }
//     }
// }

// export {getFlightTickets,createFlightTicket,updateFlightTicket,deleteFlightTicket,previewFlightTicket,downloadFlightTicket}