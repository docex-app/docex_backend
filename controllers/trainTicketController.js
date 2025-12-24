import TrainTicket from "../model/trainTicketModel.js";
import trainTicketTemplate from "../services/pdf/templates/trainTicket.template.js";
import generatePDF from "../services/pdf/pdfService.js";

/* ======================================================
   GET ALL TRAIN TICKETS
====================================================== */
const getTrainTickets = async (req, res) => {
  try {
    const tickets = await TrainTicket.find();

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Train Tickets found"
      });
    }

    res.status(200).json({
      success: true,
      trainTickets: tickets
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
   CREATE TRAIN TICKET (DB SAVE)
====================================================== */
const createTrainTicket = async (req, res) => {
  try {
    const {
      paxName,
      sourceStation,
      destStation,
      numOfPax,
      farePerPax,
      travelDate,
      trainNum,
      pnr
    } = req.body;

    if (
      !paxName ||
      !sourceStation ||
      !destStation ||
      !numOfPax ||
      !farePerPax ||
      !travelDate ||
      !trainNum ||
      !pnr
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const ticket = await TrainTicket.create(req.body);

    res.status(201).json({
      success: true,
      trainTicket: ticket
    });
  } catch (err) {
    // duplicate PNR safety
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "PNR already exists"
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
   UPDATE TRAIN TICKET
====================================================== */
const updateTrainTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await TrainTicket.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Train Ticket not found"
      });
    }

    res.status(200).json({
      success: true,
      trainTicket: updated
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
   DELETE TRAIN TICKET
====================================================== */
const deleteTrainTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TrainTicket.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Train Ticket not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Train Ticket deleted successfully"
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
   PREVIEW TRAIN TICKET (HTML ONLY)
====================================================== */
const previewTrainTicket = async (req, res) => {
  try {
    const html = trainTicketTemplate(req.body);

    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Preview failed",
      error: err.message
    });
  }
};

/* ======================================================
   DOWNLOAD TRAIN TICKET (PDF)
====================================================== */
const downloadTrainTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await TrainTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Train Ticket not found"
      });
    }

    const html = trainTicketTemplate(ticket);
    const pdfBuffer = await generatePDF(html);

    const safeName = ticket.paxName.replace(/\s+/g, "_");
    const fileName = `train_ticket_${safeName}_${ticket.pnr}.pdf`;

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${fileName}`,
      "Content-Length": pdfBuffer.length
    });

    return res.end(pdfBuffer);
  } catch (err) {
    console.error("Train download error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Train ticket download failed",
        error: err.message
      });
    }
  }
};

/* ======================================================
   EXPORTS
====================================================== */
export {
  getTrainTickets,
  createTrainTicket,
  updateTrainTicket,
  deleteTrainTicket,
  previewTrainTicket,
  downloadTrainTicket
};


// import TrainTicket from "../model/trainTicketModel.js";
// import generatePDF from "../services/pdf/pdfService.js";
// import trainTicketTemplate from "../services/pdf/templates/trainTicket.template.js";
// import transporter from "../services/email/mailer.js";
// import puppeteer from "puppeteer";
// const getTrainTickets = async (req,res)=>{
//     try{
//         const allTrainTickets = await TrainTicket.find()

//         if(!allTrainTickets || allTrainTickets.length===0){
//             return res.status(404).json({
//                 success : false,
//                 message : "No Train Tickets found !"
//             })
//         }

//         res.status(200).json({
//             success : true,
//             trainTicket : allTrainTickets
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

// const createTrainTicket = async (req,res)=>{
//     try{
//         const {paxName, sourceStation,destStation,numOfPax,farePerPax,travelDate,trainNum,pnr} = req.body;
//          if (!paxName || !sourceStation || !destStation || !numOfPax || !farePerPax || !travelDate || !trainNum || !pnr) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }
//         const newTrainTicket = new TrainTicket({paxName, sourceStation,destStation,numOfPax,farePerPax,travelDate,trainNum,pnr})
//         await newTrainTicket.save();


//         res.status(201).json({
//             success : true,
//             message : "Train Ticket Created Successfully",
//             trainTicket : newTrainTicket
//         })

//     }catch(err){
//         res.status(500).json({
//             success : false,
//             message : "Internal Server Error",
//             error : err.message
//         })
//     }

// }


// //UPDATE

// const updateTrainTicket = async (req,res)=>{
//     try{
//         const {id} = req.params;
//         const {paxName, sourceStation,destStation,numOfPax,farePerPax,travelDate,trainNum,pnr} = req.body;
//         const updatedTrainTicket = await TrainTicket.findByIdAndUpdate(id,{
//             paxName, sourceStation,destStation,numOfPax,farePerPax,travelDate,trainNum,pnr
//         }, {new:true})

//         if(!updatedTrainTicket){
//            return res.status(404).json({
//                 success : false,
//                 message : "Cannot find Train Ticket"
//             })
//         }

//         res.status(200).json({
//             success : true,
//             trainTicket : updatedTrainTicket
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
// const deleteTrainTicket = async (req,res)=>{
//     try{
//         const {id} = req.params;
//         const deletedTrainTicket = await TrainTicket.findByIdAndDelete(id);
        
//         if(!deletedTrainTicket){
//          return res.status(404).json({
//             success : false,
//             message : "Train Ticket not found for deletion"
//         })
//     }

//     res.status(200).json({
//         success : true,
//         message : "Train Ticket has been deleted Successfully"
//     })

//     }catch(err){
//         res.status(500).json({
//             success : false,
//             message : "Internal Server Error",
//             error : err.message
//         })
//     }
// }


// // //DOWNLOAD PDF

// // const downloadTrainTicket = async (req, res) => {
// //   try {
// //     const html = trainTicketTemplate(req.body);
// //     const { buffer, fileName } = await generatePDF(html, "train-ticket.pdf");

// //     res.set({
// //       "Content-Type": "application/pdf",
// //       "Content-Disposition": `attachment; filename=${fileName}`
// //     });

// //     res.send(buffer);

// //   } catch (err) {
// //     res.status(500).json({ message: "PDF generation failed" });
// //   }
// // };

// //PREVIEW
// const previewTrainTicket = async (req, res) => {
//   try {
//     const html = trainTicketTemplate(req.body);

//     res.setHeader("Content-Type", "text/html");
//     return res.send(html);

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Preview failed",
//       error: err.message
//     });
//   }
// };



// /**
//  * DOWNLOAD TRAIN TICKET PDF
//  */
// const downloadTrainTicket = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const ticket = await TrainTicket.findById(id);
//     if (!ticket) {
//       return res.status(404).json({
//         success: false,
//         message: "Train ticket not found"
//       });
//     }

//     const html = trainTicketTemplate(ticket);

//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();

//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true
//     });

//     await browser.close();

//     const safeName = ticket.paxName.replace(/\s+/g, "_");
//     const fileName = `train_ticket_${safeName}_${ticket.pnr}.pdf`;

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename=${fileName}`
//     });

//     res.send(pdfBuffer);

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Train ticket download failed",
//       error: err.message
//     });
//   }
// };


// /**
//  * EMAIL TRAIN TICKET PDF
//  */

// export {getTrainTickets,updateTrainTicket,createTrainTicket,deleteTrainTicket,downloadTrainTicket,previewTrainTicket}