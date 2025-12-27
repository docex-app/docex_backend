import Invoice from "../model/invoiceModel.js";
import InvoiceCounter from "../model/invoiceCounter.js";

import generatePDF from "../services/pdf/pdfService.js";
import invoiceTemplate from "../services/pdf/templates/invoiceTemplate.js";

import path from "path";
import fs from "fs";

/* ======================================================
   PREVIEW INVOICE (HTML ONLY)
====================================================== */
export const previewInvoiceFromData = async (req, res) => {
  try {
    const seller = req.body.seller || {};
    const client = req.body.client || {};
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const taxPercent = Number(req.body.taxPercent) || 0;

    const computedItems = items
      .filter(item => item && item.name)
      .map(item => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        return {
          name: item.name,
          quantity: qty,
          price,
          total: qty * price
        };
      });

    const subtotal = computedItems.reduce((s, i) => s + i.total, 0);
    const taxAmount = (subtotal * taxPercent) / 100;
    const totalAmount = subtotal + taxAmount;

    const html = invoiceTemplate({
      seller,
      client,
      items: computedItems,
      subtotal,
      taxPercent,
      taxAmount,
      totalAmount,
      invoiceNumber: "Preview",
      createdAt: new Date()
    });

    res.send(html);
  } catch (err) {
    console.error("Invoice Preview Error ", err);
    res.status(500).json({ success: false, message: "Failed to preview invoice" });
  }
};

/* ======================================================
   CREATE INVOICE (SAVE + PDF)
====================================================== */
export const createInvoice = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      startingInvoiceNumber,
      seller = {},
      client = {},
      items = [],
      taxPercent = 0
    } = req.body;

    if (!seller.name || !client.name || !client.email) {
      return res.status(400).json({
        success: false,
        message: "Seller and client details are required"
      });
    }

    const computedItems = items
      .filter(item => item && item.name)
      .map(item => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        return {
          name: item.name,
          quantity: qty,
          price,
          total: qty * price
        };
      });

    if (!computedItems.length) {
      return res.status(400).json({
        success: false,
        message: "At least one valid item is required"
      });
    }

    const subtotal = computedItems.reduce((s, i) => s + i.total, 0);
    const tax = Number(taxPercent) || 0;
    const taxAmount = (subtotal * tax) / 100;
    const totalAmount = subtotal + taxAmount;

    /* ---------- INVOICE NUMBER ---------- */
    let counter = await InvoiceCounter.findOne({ userId });

    if (!counter) {
      if (!startingInvoiceNumber) {
        return res.status(400).json({
          success: false,
          message: "Starting invoice number is required"
        });
      }

      counter = await InvoiceCounter.create({
        userId,
        currentInvoiceNumber: Number(startingInvoiceNumber)
      });
    } else {
      counter = await InvoiceCounter.findOneAndUpdate(
        { userId },
        { $inc: { currentInvoiceNumber: 1 } },
        { new: true }
      );
    }

    const invoiceData = {
      userId,
      invoiceNumber: counter.currentInvoiceNumber,
      seller,
      client,
      items: computedItems,
      subtotal,
      taxPercent: tax,
      taxAmount,
      totalAmount,
      status: "final",
      createdAt: new Date() 
    };

    /* ---------- PDF ---------- */
    const html = invoiceTemplate(invoiceData);
    const pdf = await generatePDF(html, `invoice-${invoiceData.invoiceNumber}.pdf`);

    const invoicesDir = path.join("uploads", "invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.join(
      invoicesDir,
      `invoice-${invoiceData.invoiceNumber}.pdf`
    );

    // fs.writeFileSync(filePath, pdf.buffer);
    fs.writeFileSync(filePath, Buffer.from(pdf.buffer));

    /* ---------- SAVE ---------- */
    const invoice = await Invoice.create({
      ...invoiceData,
      pdfPath: filePath
    });

    res.status(201).json({
      success: true,
      invoice
    });
  } catch (err) {
    console.error("Create Invoice Error ", err);
    res.status(500).json({ success: false, message: "Failed to create invoice" });
  }
};


/* ======================================================
   DELETE INVOICE
====================================================== */
export const deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.id;

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      userId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // delete PDF file if exists
    if (invoice.pdfPath) {
      try {
        fs.unlinkSync(invoice.pdfPath);
      } catch (err) {
        console.warn(" Invoice PDF not found on disk");
      }
    }

    await invoice.deleteOne();

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (err) {
    console.error("Delete Invoice Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
    });
  }
};


/* ======================================================
   DOWNLOAD PDF
====================================================== */
export const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || !invoice.pdfPath) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.download(invoice.pdfPath);
  } catch (err) {
    console.error("Download Invoice Error:", err);
    res.status(500).json({ success: false, message: "Download failed" });
  }
};
