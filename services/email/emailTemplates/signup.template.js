export const signupTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to Docex</title>
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
      color: #1e3a8a;
    }
    .content {
      font-size: 16px;
      color: #333;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #1e3a8a;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Docex 🎉</h1>
    </div>

    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>

      <p>
        We’re excited to have you onboard!  
        Docex helps you generate professional certificates, tickets, and invoices with ease.
      </p>

      <p>
        You can start creating and managing your documents right away.
      </p>

      <a href="https://docex.app" class="btn">Go to Dashboard</a>

      <p>
        If you have any questions, feel free to reply to this email.
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Docex. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
