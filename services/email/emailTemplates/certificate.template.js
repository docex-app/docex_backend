export const certificateEmailTemplate = ({
  name,
  courseName,
  instituteName,
  verifyUrl
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Your Certificate</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
      
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #16a34a;
    }
    .content {
      font-size: 16px;
      color: #333;
      line-height: 1.6;
    }
    .verify-box {
      margin-top: 20px;
      padding: 15px;
      background: #f0fdf4;
      border-left: 4px solid #16a34a;
    }
    .btn {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 18px;
      background-color: #16a34a;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Certificate Issued</h1>
    </div>

    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>

      <p>
        Congratulations on successfully completing the course
        <strong>${courseName}</strong> at <strong>${instituteName}</strong>.
      </p>

      <p>
        Your certificate is attached to this email as a PDF.
      </p>

      <div class="verify-box">
        <p><strong>Certificate Verification</strong></p>
        <p>
          You can verify the authenticity of this certificate using the link below:
        </p>
        <a href="${verifyUrl}" class="btn">Verify Certificate</a>
      </div>
    </div>

    <div class="footer">
      This is a system-generated email from Docex.
    </div>
  </div>
</body>
</html>
`;
