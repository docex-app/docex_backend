import Certificate from "../model/certificatesModel.js";
import TrainTicket from "../model/trainTicketModel.js";
import FlightTicket from "../model/flightTicketModel.js";
import Invoice from "../model/invoiceModel.js";

/* ======================================================
   DASHBOARD ANALYTICS
====================================================== */
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    /* =========================
       COUNTS (IMPORTANT FIX)
    ========================== */
    const [
      certificateCount,
      trainTicketCount,
      flightTicketCount,
      invoiceCount,
    ] = await Promise.all([
      Certificate.countDocuments({ user: userId }),     // ✅ FIX
      TrainTicket.countDocuments({ user: userId }),     // ✅ FIX
      FlightTicket.countDocuments({ user: userId }),    // ✅ FIX
      Invoice.countDocuments({ userId }),               // invoices use userId
    ]);

    const totalDocuments =
      certificateCount +
      trainTicketCount +
      flightTicketCount +
      invoiceCount;

    /* =========================
       GENERATED TODAY
    ========================== */
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      certificatesToday,
      trainTicketsToday,
      flightTicketsToday,
      invoicesToday,
    ] = await Promise.all([
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
      Invoice.countDocuments({
        userId,
        createdAt: { $gte: startOfToday },
      }),
    ]);

    const totalGeneratedToday =
      certificatesToday +
      trainTicketsToday +
      flightTicketsToday +
      invoicesToday;

    /* =========================
       TOTAL REVENUE
    ========================== */
    const revenueAgg = await Invoice.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    /* =========================
       RECENT ACTIVITY
    ========================== */
    const [
      recentCertificates,
      recentTrainTickets,
      recentFlightTickets,
      recentInvoices,
    ] = await Promise.all([
      Certificate.find({ user: userId })
        .select("name createdAt")
        .sort({ createdAt: -1 })
        .limit(5),

      TrainTicket.find({ user: userId })
        .select("paxName createdAt")
        .sort({ createdAt: -1 })
        .limit(5),

      FlightTicket.find({ user: userId })
        .select("paxName createdAt")
        .sort({ createdAt: -1 })
        .limit(5),

      Invoice.find({ userId })
        .select("invoiceNumber client totalAmount createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const recentActivity = [
      ...recentCertificates.map((c) => ({
        type: "certificate",
        title: c.name,
        createdAt: c.createdAt,
      })),
      ...recentTrainTickets.map((t) => ({
        type: "trainTicket",
        title: `Train Ticket - ${t.paxName}`,
        createdAt: t.createdAt,
      })),
      ...recentFlightTickets.map((f) => ({
        type: "flightTicket",
        title: `Flight Ticket - ${f.paxName}`,
        createdAt: f.createdAt,
      })),
      ...recentInvoices.map((i) => ({
        type: "invoice",
        title: `Invoice #${i.invoiceNumber} - ${i.client?.name || "Client"}`,
        createdAt: i.createdAt,
        amount: i.totalAmount,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      analytics: {
        totalDocuments,
        generatedToday: totalGeneratedToday,
        processing: 0,
        revenue: totalRevenue,
        counts: {
          certificates: certificateCount,
          invoices: invoiceCount,
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


