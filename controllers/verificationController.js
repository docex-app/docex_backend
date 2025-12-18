import Certificate from "../model/certificatesModel.js";

const verifyCertificatePage = async (req, res) => {
  try {
    const { verificationId } = req.params;

    if (!verificationId) {
      return res.status(400).send("Invalid verification request");
    }

    const certificate = await Certificate.findOne({ verificationId });

    if (!certificate) {
      return res.status(404).send(`
        <h2>❌ Invalid Certificate</h2>
        <p>This certificate does not exist.</p>
      `);
    }

    res.setHeader("Cache-Control", "no-store");

    res.send(`
      <html>
        <head>
          <title>Certificate Verification</title>
          <style>
            body {
              font-family: Arial;
              background: #f9fafb;
              padding: 40px;
            }
            .card {
              max-width: 600px;
              margin: auto;
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .success {
              color: green;
              font-size: 22px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success">✔ Certificate Verified</div>
            <p><strong>Name:</strong> ${certificate.name}</p>
            <p><strong>Course:</strong> ${certificate.courseName}</p>
            <p><strong>Institute:</strong> ${certificate.instituteName}</p>
            <p><strong>Issued On:</strong> ${certificate.createdAt.toDateString()}</p>
          </div>
        </body>
      </html>
    `);

  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export default verifyCertificatePage;
