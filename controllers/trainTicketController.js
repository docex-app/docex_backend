import TrainTicket from "../model/trainTicketModel.js";
import trainTicketTemplate from "../services/pdf/templates/trainTicket.template.js";
import generatePDF from "../services/pdf/pdfService.js";

/* ======================================================
   GET MY TRAIN TICKETS
====================================================== */
const getTrainTickets = async (req, res) => {
  try {
    const tickets = await TrainTicket.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

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
   CREATE TRAIN TICKET
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

    const ticket = await TrainTicket.create({
      user: req.user.id, // 🔑 OWNERSHIP
      paxName,
      sourceStation,
      destStation,
      numOfPax,
      farePerPax,
      travelDate,
      trainNum,
      pnr
    });

    res.status(201).json({
      success: true,
      trainTicket: ticket
    });
  } catch (err) {
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

    const updated = await TrainTicket.findOneAndUpdate(
      { _id: id, user: req.user.id }, // 🔒 OWNERSHIP CHECK
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

    const deleted = await TrainTicket.findOneAndDelete({
      _id: id,
      user: req.user.id // 🔒 OWNERSHIP CHECK
    });

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
   PREVIEW TRAIN TICKET (PUBLIC)
====================================================== */
const previewTrainTicket = async (req, res) => {
  try {
    const html = trainTicketTemplate(req.body);
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
   DOWNLOAD TRAIN TICKET (PROTECTED)
====================================================== */
const downloadTrainTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await TrainTicket.findOne({
      _id: id,
      user: req.user.id // 🔒 OWNERSHIP CHECK
    });

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

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${fileName}`
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Train ticket download failed",
      error: err.message
    });
  }
};

export {
  getTrainTickets,
  createTrainTicket,
  updateTrainTicket,
  deleteTrainTicket,
  previewTrainTicket,
  downloadTrainTicket
};
