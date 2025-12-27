export default function invoiceTemplate(invoice) {
  const {
    invoiceNumber,
    createdAt,
    seller,
    client,
    items,
    subtotal,
    taxPercent,
    taxAmount,
    totalAmount
  } = invoice;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${invoiceNumber}</title>

  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      color: #333;
      margin: 0;
      padding: 40px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }

    .company {
      max-width: 60%;
    }

    .invoice-details {
      text-align: right;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-weight: bold;
      margin-bottom: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }

    th {
      background: #f4f4f4;
      font-weight: bold;
    }

    .text-right {
      text-align: right;
    }

    .totals {
      margin-top: 20px;
      width: 40%;
      float: right;
    }

    .totals td {
      border: none;
      padding: 6px 10px;
    }

    .totals tr td:first-child {
      text-align: left;
    }

    .totals tr td:last-child {
      text-align: right;
    }

    .grand-total {
      font-size: 16px;
      font-weight: bold;
      border-top: 2px solid #333;
      padding-top: 10px;
    }

    .footer {
      margin-top: 80px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>

<body>

  <!-- HEADER -->
  <div class="header">
    <div class="company">
      <h1>${seller?.name || "Your Company Name"}</h1>
      <p>
        ${seller?.address || ""}<br/>
        ${seller?.email || ""}<br/>
        ${seller?.phone || ""}<br/>
        ${seller?.gst ? `GST: ${seller.gst}` : ""}
      </p>
    </div>

    <div class="invoice-details">
      <h2>Invoice</h2>
      <p>
        <strong>Invoice #:</strong> ${invoiceNumber}<br/>
        <strong>Date:</strong> ${formattedDate}
      </p>
    </div>
  </div>

  <!-- CLIENT -->
  <div class="section">
    <div class="section-title">Bill To:</div>
    <p>
      <strong>${client?.name || ""}</strong><br/>
      ${client?.address || ""}<br/>
      ${client?.email || ""}<br/>
      ${client?.phone || ""}<br/>
      ${client?.gst ? `GST: ${client.gst}` : ""}
    </p>
  </div>

  <!-- ITEMS TABLE -->
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map(
          (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">₹${item.price.toFixed(2)}</td>
            <td class="text-right">₹${item.total.toFixed(2)}</td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  </table>

  <!-- TOTALS -->
  <table class="totals">
    <tr>
      <td>Subtotal</td>
      <td>₹${subtotal.toFixed(2)}</td>
    </tr>

    ${
      taxPercent > 0
        ? `
      <tr>
        <td>Tax (${taxPercent}%)</td>
        <td>₹${taxAmount.toFixed(2)}</td>
      </tr>
    `
        : ""
    }

    <tr class="grand-total">
      <td>Total</td>
      <td>₹${totalAmount.toFixed(2)}</td>
    </tr>
  </table>

  <div style="clear: both;"></div>

  <!-- FOOTER -->
  <div class="footer">
    Thank you for your business 🙏<br/>
    Generated using Docex
  </div>

</body>
</html>
`;
}
