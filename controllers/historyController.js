import Certificate from "../model/certificatesModel.js";
import TrainTicket from "../model/trainTicketModel.js";
import FlightTicket from "../model/flightTicketModel.js";
import Invoice from "../model/invoiceModel.js";

/* ======================================================
   GET USER HISTORY
====================================================== */
const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [certificates, trainTickets, flightTickets, invoices] =
      await Promise.all([
        Certificate.find({ user: userId }).select("name createdAt"),
        TrainTicket.find({ user: userId }).select("paxName createdAt"),
        FlightTicket.find({ user: userId }).select("paxName createdAt"),
        Invoice.find({ userId }).select(
          "invoiceNumber client totalAmount createdAt"
        ),
      ]);

    const history = [
      ...certificates.map((c) => ({
        documentId: c._id,
        title: c.name,
        type: "certificate",
        createdAt: c.createdAt,
      })),
      ...trainTickets.map((t) => ({
        documentId: t._id,
        title: `Train Ticket - ${t.paxName}`,
        type: "trainTicket",
        createdAt: t.createdAt,
      })),
      ...flightTickets.map((f) => ({
        documentId: f._id,
        title: `Flight Ticket - ${f.paxName}`,
        type: "flightTicket",
        createdAt: f.createdAt,
      })),
      ...invoices.map((i) => ({
        documentId: i._id,
        title: `Invoice #${i.invoiceNumber} - ${i.client?.name || "Client"}`,
        type: "invoice",
        createdAt: i.createdAt,
        amount: i.totalAmount,
      })),
    ];

    history.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      history,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
      error: err.message,
    });
  }
};

export { getUserHistory };
