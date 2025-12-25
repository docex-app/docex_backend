import Certificate from "../model/certificatesModel.js";
import TrainTicket from "../model/trainTicketModel.js";
import FlightTicket from "../model/flightTicketModel.js";

/* ======================================================
   DASHBOARD ANALYTICS
====================================================== */
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    /* =========================
       FETCH COUNTS
    ========================== */
    const [
      certificateCount,
      trainTicketCount,
      flightTicketCount,
    ] = await Promise.all([
      Certificate.countDocuments({ user: userId }),
      TrainTicket.countDocuments({ user: userId }),
      FlightTicket.countDocuments({ user: userId }),
    ]);

    const totalDocuments =
      certificateCount + trainTicketCount + flightTicketCount;

    /* =========================
       GENERATED TODAY
    ========================== */
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const generatedToday = await Promise.all([
      Certificate.countDocuments({
        user: userId,
        createdAt: { $gte: startOfToday },
      }),
      TrainTicket.countDocuments({
        user: userId,
        createdAt: { $gte: startOfToday },
      }),
      FlightTicket.countDocuments({
        user: userId,
        createdAt: { $gte: startOfToday },
      }),
    ]);

    const totalGeneratedToday =
      generatedToday[0] + generatedToday[1] + generatedToday[2];

    /* =========================
       RECENT ACTIVITY (LAST 5)
    ========================== */
    const recentCertificates = await Certificate.find({ user: userId })
      .select("name createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTrainTickets = await TrainTicket.find({ user: userId })
      .select("paxName createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentFlightTickets = await FlightTicket.find({ user: userId })
      .select("paxName createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = [
      ...recentCertificates.map((c) => ({
        type: "Certificate",
        name: c.name,
        createdAt: c.createdAt,
        status: "completed",
      })),
      ...recentTrainTickets.map((t) => ({
        type: "Train Ticket",
        name: `Train Ticket - ${t.paxName}`,
        createdAt: t.createdAt,
        status: "completed",
      })),
      ...recentFlightTickets.map((f) => ({
        type: "Flight Ticket",
        name: `Flight Ticket - ${f.paxName}`,
        createdAt: f.createdAt,
        status: "completed",
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      analytics: {
        totalDocuments,
        generatedToday: totalGeneratedToday,
        processing: 0, // for now
        counts: {
          certificates: certificateCount,
          travel: trainTicketCount + flightTicketCount,
        },
        recentActivity,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
      error: err.message,
    });
  }
};

export { getDashboardAnalytics };
