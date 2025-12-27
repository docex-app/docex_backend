export const signupTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome to Docex</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0; padding:0; background-color:#f2f4f7; font-family: Arial, Helvetica, sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f7; padding:24px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
          
          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding:32px 24px 16px;">
              <img
                src="https://app.docex.in/docex-logo.png"
                alt="Docex"
                width="64"
                height="64"
                style="display:block; margin-bottom:12px;"
              />
              <h1 style="margin:0; font-size:24px; color:#111827;">
                Welcome to Docex 🎉
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px; color:#374151; font-size:16px; line-height:1.6;">
              <p style="margin:0 0 16px;">
                Hi <strong>${name}</strong>,
              </p>

              <p style="margin:0 0 16px;">
                We’re excited to have you onboard!
              </p>

              <p style="margin:0 0 16px;">
                <strong>Docex</strong> helps you generate professional
                <strong>certificates</strong>, <strong>tickets</strong>, and
                <strong>invoices</strong> — quickly and effortlessly.
              </p>

              <p style="margin:0 0 24px;">
                You can start creating and managing your documents right away.
              </p>

              <!-- Button -->
              <div style="text-align:center;">
                <a
                  href="https://app.docex.in"
                  style="
                    display:inline-block;
                    padding:14px 28px;
                    background-color:#6366f1;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:600;
                    font-size:16px;
                  "
                >
                  Go to Dashboard →
                </a>
              </div>

              <p style="margin:24px 0 0; font-size:14px; color:#6b7280;">
                If you have any questions, just reply to this email —
                we’re happy to help.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px; background-color:#f9fafb; font-size:12px; color:#9ca3af;">
              © ${new Date().getFullYear()} Docex. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
