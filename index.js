import express from "express"
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import certificateRouter from "./routes/certificateRoutes.js";
import trainTicketRouter from "./routes/trainTicketRoutes.js"
import flightTicketRouter from "./routes/flightTicketRoutes.js"
import verificationRouter from "./routes/verificationRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";




dotenv.config();


const app = express()
app.use(express.json());
const PORT = process.env.PORT || 8000;


connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.get("/", (req,res)=>{
    res.send("Docex server is running...")
})

app.use("/api/certificates", certificateRouter)
app.use("/api/trainTickets", trainTicketRouter)
app.use("/api/flightTickets", flightTicketRouter)
app.use("/api/verify", verificationRouter);
app.use("/api/email", emailRoutes);



app.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})
