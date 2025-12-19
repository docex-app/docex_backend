const certificateTemplate = ({
  name,
  instituteName,
  courseName,
  grade,
  issuedDate,
  qrCodeBase64
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Certificate of Completion</title>

  <style>
    body {
      font-family: "Georgia", serif;
      background: #f4f4f4;
      padding: 40px;
      color: #000;
    }

    .certificate {
      background: white;
      width: 800px;
      margin: auto;
      padding: 40px;
      border: 12px solid #1e3a8a;
      position: relative;
    }

    .header {
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 36px;
      letter-spacing: 2px;
      color: #1e3a8a;
    }

    .sub-heading {
      font-size: 18px;
      margin-top: 10px;
      color: #444;
    }

    .content {
      margin-top: 50px;
      text-align: center;
      font-size: 20px;
      line-height: 1.6;
    }

    .name {
      font-size: 32px;
      font-weight: bold;
      margin: 20px 0;
      color: #000;
    }

    .details {
      margin-top: 20px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 60px;
    }

    .signature {
      text-align: center;
    }

    .signature-line {
      width: 200px;
      border-top: 2px solid #000;
      margin-bottom: 8px;
    }

    .qr {
      text-align: center;
    }

    .qr img {
      width: 120px;
      height: 120px;
    }

    .issued-date {
      font-size: 14px;
      color: #555;
      margin-top: 10px;
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 80px;
      color: rgba(0,0,0,0.05);
      transform: rotate(-30deg);
      pointer-events: none;
    }
  </style>
</head>

<body>
  <div class="certificate">
    <div class="watermark">DOCEX</div>

    <div class="header">
      <h1>CERTIFICATE OF COMPLETION</h1>
      <div class="sub-heading">${instituteName}</div>
    </div>

    <div class="content">
      This is to certify that

      <div class="name">${name}</div>

      has successfully completed the course

      <strong>${courseName}</strong>

      <div class="details">
        with grade <strong>${grade}</strong>
      </div>
    </div>

    <div class="footer">
      <div class="signature">
        <div class="signature-line"></div>
        <div>Authorized Signatory</div>
        <div class="issued-date">
          Issued on: ${issuedDate}
        </div>
      </div>

      <div class="qr">
        <img src="data:image/png;base64,${qrCodeBase64}" />
        <div class="issued-date">Scan to verify</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

export default certificateTemplate;