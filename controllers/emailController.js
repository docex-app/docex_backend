import transporter from "../services/email/mailer.js";
import generatePDF from "../services/pdf/pdfService.js";

import Certificate from "../model/certificatesModel.js";
import TrainTicket from "../model/trainTicketModel.js";
import FlightTicket from "../model/flightTicketModel.js";

import certificateTemplate from "../services/pdf/templates/certificate.template.js";
import trainTicketTemplate from "../services/pdf/templates/trainTicket.template.js";
import flightTicketTemplate from "../services/pdf/templates/flightTicket.template.js";

import generateQRBuffer from "../services/qrCode/qrService.js";
import { signupTemplate } from "../services/email/emailTemplates/signup.template.js";


import Invoice from "../model/invoiceModel.js";
import invoiceTemplate from "../services/pdf/templates/invoiceTemplate.js";
import fs from "fs";
import path from "path";
/* ======================================================
   SIGNUP EMAIL
====================================================== */
const sendSignupEmail = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    await transporter.sendMail({
      from: `"Docex" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Docex 🎉",
      html: signupTemplate(name),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Signup email failed",
      error: err.message,
    });
  }
};

/* ======================================================
   CERTIFICATE EMAIL
====================================================== */
const sendCertificateEmail = async (req, res) => {
  try {
    const { certificateId, email } = req.body;

    const certificate = await Certificate.findById(certificateId);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const verifyUrl = `${process.env.BASE_URL}/verify/certificate/${certificate.verificationId}`;
    const qrBuffer = await generateQRBuffer(verifyUrl);

    const html = certificateTemplate({
      ...certificate.toObject(),
      issuedDate: certificate.createdAt.toDateString(),
      qrCodeBase64: qrBuffer.toString("base64"),
    });

    const pdfBuffer = await generatePDF(html);

    await transporter.sendMail({
      from: `"Docex" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Certificate 🎓",
      attachments: [{ filename: "certificate.pdf", content: pdfBuffer }],
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   TRAIN TICKET EMAIL
====================================================== */
const sendTrainTicketEmail = async (req, res) => {
  try {
    const { ticketId, email } = req.body;

    const ticket = await TrainTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Train ticket not found" });
    }

    const html = trainTicketTemplate(ticket);
    const pdfBuffer = await generatePDF(html);

    await transporter.sendMail({
      from: `"Docex Tickets" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Train Ticket 🚆",
      attachments: [{ filename: "train-ticket.pdf", content: pdfBuffer }],
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   FLIGHT TICKET EMAIL
====================================================== */
const sendFlightTicketEmail = async (req, res) => {
  try {
    const { ticketId, email } = req.body;

    const ticket = await FlightTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Flight ticket not found" });
    }

    const html = flightTicketTemplate(ticket);
    const pdfBuffer = await generatePDF(html);

    await transporter.sendMail({
      from: `"Docex Tickets" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Flight Ticket ✈️",
      attachments: [{ filename: "flight-ticket.pdf", content: pdfBuffer }],
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   RESEND DOCUMENT EMAIL (REGENERATE PDF)
====================================================== */
const resendDocumentEmail = async (req, res) => {
  try {
    const { type, documentId } = req.body;

    let document;
    let html;
    let filename;
    let recipientEmail;

    if (type === "certificate") {
      document = await Certificate.findById(documentId);
      if (!document) return res.status(404).json({ message: "Certificate not found" });

      const verifyUrl = `${process.env.BASE_URL}/verify/certificate/${document.verificationId}`;
      const qrBuffer = await generateQRBuffer(verifyUrl);

      html = certificateTemplate({
        ...document.toObject(),
        issuedDate: document.createdAt.toDateString(),
        qrCodeBase64: qrBuffer.toString("base64"),
      });

      filename = "certificate.pdf";
      recipientEmail = document.email;
    }

    if (type === "trainTicket") {
      document = await TrainTicket.findById(documentId);
      if (!document) return res.status(404).json({ message: "Train ticket not found" });

      html = trainTicketTemplate(document);
      filename = "train-ticket.pdf";
      recipientEmail = document.email ;
    }

    if (type === "flightTicket") {
      document = await FlightTicket.findById(documentId);
      if (!document) return res.status(404).json({ message: "Flight ticket not found" });

      html = flightTicketTemplate(document);
      filename = "flight-ticket.pdf";
      recipientEmail = document.email;
    }

    if (!html) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    if (!recipientEmail) {
      return res.status(400).json({ message: "Recipient email not found in document" });
    }

    const pdfBuffer = await generatePDF(html);

    const info = await transporter.sendMail({
      from: `"Docex" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `Your ${type} from Docex`,
      attachments: [{ filename, content: pdfBuffer }],
    });

    console.log("MAIL INFO:", info);

    res.json({ success: true });
  } catch (err) {
    console.error("Email resend failed:", err);
    res.status(500).json({
      message: "Failed to resend email",
      error: err.message,
    });
  }
};

/* ======================================================
   INVOICE EMAIL
====================================================== */
const sendInvoiceEmail = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: "invoiceId is required"
      });
    }

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    if (!invoice.pdfPath) {
      return res.status(400).json({
        success: false,
        message: "Invoice PDF not generated yet"
      });
    }

    if (!invoice.client?.email) {
      return res.status(400).json({
        success: false,
        message: "Client email not found"
      });
    }

    await transporter.sendMail({
      from: `"Docex" <${process.env.SMTP_USER}>`,
      to: invoice.client.email,
      subject: `Invoice #${invoice.invoiceNumber}`,
      html: `
        <p>Hello ${invoice.client.name || "Customer"},</p>
        <p>Please find attached your invoice.</p>
        <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
        <p>Thank you for your business 🙏</p>
        <br/>
        <p>— Team Docex</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          path: path.resolve(invoice.pdfPath)
        }
      ]
    });

    res.json({
      success: true,
      message: "Invoice emailed successfully"
    });

  } catch (err) {
    console.error("Invoice email failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to email invoice",
      error: err.message
    });
  }
};


/* ======================================================
   EXPORTS
====================================================== */
export {
  sendSignupEmail,
  sendCertificateEmail,
  sendTrainTicketEmail,
  sendFlightTicketEmail,
  resendDocumentEmail,
  sendInvoiceEmail
};


// import puppeteer from "puppeteer";
// import transporter from "../services/email/mailer.js";
// import { signupTemplate } from "../services/email/emailTemplates/signup.template.js";
// import certificateTemplate from "../services/pdf/templates/certificate.template.js";
// import generateQRBuffer from "../services/qrCode/qrService.js";
// import Certificate from "../model/certificatesModel.js";
// import TrainTicket from "../model/trainTicketModel.js";
// import trainTicketTemplate from "../services/pdf/templates/trainTicket.template.js";
// import FlightTicket from "../model/flightTicketModel.js";
// import flightTicketTemplate from "../services/pdf/templates/flightTicket.template.js";
// import generatePDF from "../services/pdf/pdfService.js";
// /* ======================================================
//    SIGNUP EMAIL
// ====================================================== */
// const sendSignupEmail = async (req, res) => {
//   try {
//     const { email, name } = req.body;

//     if (!email || !name) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and name are required"
//       });
//     }

//     await transporter.sendMail({
//       from: `"Docex" <${process.env.SMTP_USER}>`,
//       to: email,
//       subject: "Welcome to Docex 🎉",
//       html: signupTemplate(name)
//     });

//     res.json({
//       success: true,
//       message: "Signup email sent successfully"
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Signup email sending failed",
//       error: err.message
//     });
//   }
// };

// /* ======================================================
//    CERTIFICATE EMAIL WITH PDF ATTACHMENT
// ====================================================== */
// const sendCertificateEmail = async (req, res) => {
//   try {
//     const { certificateId, email } = req.body;

//     if (!certificateId || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "certificateId and email are required"
//       });
//     }

//     const certificate = await Certificate.findById(certificateId);
//     if (!certificate) {
//       return res.status(404).json({
//         success: false,
//         message: "Certificate not found"
//       });
//     }

//     const verifyUrl = `${process.env.BASE_URL}/verify/certificate/${certificate.verificationId}`;
//     const qrBuffer = await generateQRBuffer(verifyUrl);
//     const qrCodeBase64 = qrBuffer.toString("base64");

//     const html = certificateTemplate({
//       name: certificate.name,
//       instituteName: certificate.instituteName,
//       courseName: certificate.courseName,
//       grade: certificate.grade,
//       issuedDate: certificate.createdAt.toDateString(),
//       qrCodeBase64
//     });

//     // Generate PDF
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });
//     const pdfBuffer = await page.pdf({ 
//         format: "A4",
//         landscape: true,
//         printBackground: true

//     });
//     await browser.close();

//     await transporter.sendMail({
//       from: `"Docex" <${process.env.SMTP_USER}>`,
//       to: email,
//       subject: "Your Certificate from Docex 🎓",
//       html: `
//         <p>Hello ${certificate.name},</p>
//         <p>Your certificate is attached below.</p>
//         <p>You can verify it anytime using the QR code.</p>
//       `,
//       attachments: [
//         {
//           filename: "certificate.pdf",
//           content: pdfBuffer,
//           contentType: "application/pdf"
//         }
//       ]
//     });

//     res.json({
//       success: true,
//       message: "Certificate email sent successfully"
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Certificate email sending failed",
//       error: err.message
//     });
//   }
// };


// /* ======================================================
//    TRAIN TICKET EMAIL WITH PDF ATTACHMENT
// ====================================================== */
// const sendTrainTicketEmail = async (req, res) => {
//   try {
//     const { ticketId, email } = req.body;

//     if (!ticketId || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "ticketId and email are required"
//       });
//     }

//     const ticket = await TrainTicket.findById(ticketId);
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

//     await transporter.sendMail({
//       from: `"Docex Tickets" <${process.env.SMTP_USER}>`,
//       to: email,
//       subject: "Your Train Ticket 🚆",
//       html: `
//         <p>Hello ${ticket.paxName},</p>
//         <p>Your train ticket is attached.</p>
//         <p>Have a safe journey!</p>
//       `,
//       attachments: [
//         {
//           filename: "train-ticket.pdf",
//           content: pdfBuffer,
//           contentType: "application/pdf"
//         }
//       ]
//     });

//     res.json({
//       success: true,
//       message: "Train ticket email sent successfully"
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Train ticket email sending failed",
//       error: err.message
//     });
//   }
// };



// const sendFlightTicketEmail = async (req,res)=>{
//   try {
//    const { ticketId, email } = req.body;


// if (!ticketId || !email) {
//   return res.status(400).json({
//     success: false,
//     message: "ticketId and email are required"
//   });
// }


// const ticket = await FlightTicket.findById(ticketId);

// if (!ticket) {
//   return res.status(404).json({
//     success: false,
//     message: "Flight ticket not found"
//   });
// }

// const html = flightTicketTemplate({
//   paxName: ticket.paxName,
//   numOfPax: ticket.numOfPax,
//   farePerPax: ticket.farePerPax,
//   pnr: ticket.pnr,
//   travelDate: ticket.travelDate
// });

// const pdfBuffer = await generatePDF(html);
// await transporter.sendMail({
//   from: `"Docex Tickets" <${process.env.SMTP_USER}>`,
//   to: email,
//   subject: "Your Flight Ticket ✈️",
//   html: `
//     <p>Hello ${ticket.paxName},</p>
//     <p>Your flight ticket is attached.</p>
//     <p>PNR: <b>${ticket.pnr}</b></p>
//   `,
//   attachments: [
//     {
//       filename: "flight-ticket.pdf",
//       content: pdfBuffer,
//       contentType: "application/pdf"
//     }
//   ]
// });
// res.json({
//   success: true,
//   message: "Flight ticket emailed successfully"
// });


//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Flight ticket email failed",
//       error: err.message
//     });
//   }

// }
// /* ======================================================
//    EXPORTS (IMPORTANT)
// ====================================================== */
// export {
//   sendSignupEmail,
//   sendCertificateEmail,
//   sendTrainTicketEmail,
//   sendFlightTicketEmail,
  
// };
