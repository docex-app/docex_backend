import mongoose from "mongoose";
import puppeteer from "puppeteer";
import Certificate from "../model/certificatesModel.js";
import generateQRBuffer from "../services/qrCode/qrService.js";
import certificateTemplate from "../services/pdf/templates/certificate.template.js";




/* ======================================================
   READ ALL CERTIFICATES
====================================================== */
const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();

    if (!certificates || certificates.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No certificates found"
      });
    }

    res.status(200).json({
      success: true,
      certificates
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
   CREATE CERTIFICATE
====================================================== */
const createCertificate = async (req, res) => {
  try {
    const { name, instituteName, courseName, grade } = req.body;

    if (!name || !instituteName || !courseName || !grade) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const certificate = await Certificate.create({
      name,
      instituteName,
      courseName,
      grade,
      verificationId: new mongoose.Types.ObjectId().toString()
    });

    res.status(201).json({
      success: true,
      certificate
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Certificate creation failed",
      error: err.message
    });
  }
};

/* ======================================================
   UPDATE CERTIFICATE
====================================================== */
const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, instituteName, courseName, grade } = req.body;

    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      { name, instituteName, courseName, grade },
      { new: true }
    );

    if (!updatedCertificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    res.status(200).json({
      success: true,
      certificate: updatedCertificate
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Certificate update failed",
      error: err.message
    });
  }
};

/* ======================================================
   DELETE CERTIFICATE
====================================================== */
const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Certificate.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Certificate deletion failed",
      error: err.message
    });
  }
};

/* ======================================================
   PREVIEW CERTIFICATE (HTML)
====================================================== */
// const previewCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const certificate = await Certificate.findById(id);
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

//     res.setHeader("Content-Type", "text/html");
//     res.send(html);
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Certificate preview failed",
//       error: err.message
//     });
//   }
// };

const previewCertificate = async (req, res) => {
  try {
    const { name, instituteName, courseName, grade } = req.body;

    if (!name || !instituteName || !courseName || !grade) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // TEMP verification URL (NO DB)
    const verifyUrl = "https://docex.app/verify/preview";

    const qrBuffer = await generateQRBuffer(verifyUrl);
    const qrCodeBase64 = qrBuffer.toString("base64");

    const html = certificateTemplate({
      name,
      instituteName,
      courseName,
      grade,
      issuedDate: new Date().toDateString(),
      qrCodeBase64
    });

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    res.status(500).json({
      message: "Preview failed",
      error: err.message
    });
  }
};


/* ======================================================
   DOWNLOAD CERTIFICATE (PDF)
====================================================== */
const downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    const verifyUrl = `${process.env.BASE_URL}/verify/certificate/${certificate.verificationId}`;
    const qrBuffer = await generateQRBuffer(verifyUrl);
    const qrCodeBase64 = qrBuffer.toString("base64");

    const html = certificateTemplate({
      name: certificate.name,
      instituteName: certificate.instituteName,
      courseName: certificate.courseName,
      grade: certificate.grade,
      issuedDate: certificate.createdAt.toDateString(),
      qrCodeBase64
    });

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ 
      format: "A4",
      landscape: true,
      printBackground: true
   });
    await browser.close();

    const safeName = certificate.name.replace(/\s+/g, "_");
    const fileName = `certificate_${safeName}_${certificate.verificationId}.pdf`;


  res.set({
  "Content-Type": "application/pdf",
  "Content-Disposition": `attachment; filename=${fileName}`
  });


    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Certificate download failed",
      error: err.message
    });
  }
};


//EMAIL CERTIFICATE
// const sendCertificateEmail = async (email, pdfBuffer) => {
//   await transporter.sendMail({
//     from: `"Docex Certificates" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: "Your Certificate is Ready 🎓",
//     html: `
//       <p>Your certificate is attached.</p>
//       <p>You can also verify it using the QR code.</p>
//     `,
//     attachments: [
//       {
//         filename: "certificate.pdf",
//         content: pdfBuffer,
//         contentType: "application/pdf"
//       }
//     ]
//   });
// };


/* ======================================================
   EXPORTS
====================================================== */
export {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  previewCertificate,
  downloadCertificate,
  // sendCertificateEmail
};
