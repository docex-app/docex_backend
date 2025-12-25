import Certificate from "../model/certificatesModel.js";
import TrainTicket from "../model/trainTicketModel.js";
import FlightTicket from "../model/flightTicketModel.js";

/* ======================================================
   GET USER HISTORY
====================================================== */
const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    /* =========================
       FETCH DATA IN PARALLEL
    ========================== */
    const [certificates, trainTickets, flightTickets] = await Promise.all([
      Certificate.find({ user: userId }).select("name createdAt"),
      TrainTicket.find({ user: userId }).select("paxName createdAt"),
      FlightTicket.find({ user: userId }).select("paxName createdAt"),
    ]);

    /* =========================
       NORMALIZE DATA
    ========================== */
    const history = [
      ...certificates.map((c) => ({
        id: c._id,
        title: c.name,
        type: "Certificate",
        createdAt: c.createdAt,
      })),

      ...trainTickets.map((t) => ({
        id: t._id,
        title: `Train Ticket - ${t.paxName}`,
        type: "Train Ticket",
        createdAt: t.createdAt,
      })),

      ...flightTickets.map((f) => ({
        id: f._id,
        title: `Flight Ticket - ${f.paxName}`,
        type: "Flight Ticket",
        createdAt: f.createdAt,
      })),
    ];

    /* =========================
       SORT BY LATEST
    ========================== */
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
