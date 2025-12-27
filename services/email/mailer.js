import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  connectionTimeout: 20_000, // 20 seconds
  greetingTimeout: 20_000,
  socketTimeout: 20_000
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP verify failed:", error.message);
  } else {
    console.log("✅ SMTP server ready to send emails");
  }
});


export default transporter;


// import nodemailer from "nodemailer";


// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false, // true for 465, false for 587
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// export default transporter;
