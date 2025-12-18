import puppeteer from "puppeteer";
import transporter from "../services/email/mailer.js";
import { signupTemplate } from "../services/email/emailTemplates/signup.template.js";
import certificateTemplate from "../services/pdf/templates/certificate.template.js";
import generateQRBuffer from "../services/qrCode/qrService.js";
import Certificate from "../model/certificatesModel.js";

/* ======================================================
   SIGNUP EMAIL
====================================================== */
const sendSignupEmail = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required"
      });
    }

    await transporter.sendMail({
      from: `"Docex" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Docex 🎉",
      html: signupTemplate(name)
    });

    res.json({
      success: true,
      message: "Signup email sent successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Signup email sending failed",
      error: err.message
    });
  }
};

/* ======================================================
   CERTIFICATE EMAIL WITH PDF ATTACHMENT
====================================================== */
const sendCertificateEmail = async (req, res) => {
  try {
    const { certificateId, email } = req.body;

    if (!certificateId || !email) {
      return res.status(400).json({
        success: false,
        message: "certificateId and email are required"
      });
    }

    const certificate = await Certificate.findById(certificateId);
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

    // Generate PDF
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    await transporter.sendMail({
      from: `"Docex" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Certificate from Docex 🎓",
      html: `
        <p>Hello ${certificate.name},</p>
        <p>Your certificate is attached below.</p>
        <p>You can verify it anytime using the QR code.</p>
      `,
      attachments: [
        {
          filename: "certificate.pdf",
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    });

    res.json({
      success: true,
      message: "Certificate email sent successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Certificate email sending failed",
      error: err.message
    });
  }
};

/* ======================================================
   EXPORTS (IMPORTANT)
====================================================== */
export {
  sendSignupEmail,
  sendCertificateEmail
};
