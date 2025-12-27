import express from "express"
import cors from "cors";
import path from "path";

import dotenv from "dotenv"
import connectDB from "./config/db.js";
import certificateRouter from "./routes/certificateRoutes.js";
import trainTicketRouter from "./routes/trainTicketRoutes.js"
import flightTicketRouter from "./routes/flightTicketRoutes.js"
import verificationRouter from "./routes/verificationRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import userRoutes from "./routes/userRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import invoiceRoutes from "./routes/invoiceRoutes.js";








dotenv.config();


const app = express()
app.use(cors())
app.use(express.json());
const PORT = process.env.PORT || 8000;


connectDB();


// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
//   })
// );

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://docexapp.netlify.app/login",
//   "https://app.docex.in"
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (Postman, server-to-server)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
//   })
// );


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/certificates", certificateRouter)
app.use("/api/invoices", invoiceRoutes);
app.use("/api/trainTickets", trainTicketRouter)
app.use("/api/flightTickets", flightTicketRouter)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/verify", verificationRouter);
app.use("/api/email", emailRoutes);


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));




app.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})
