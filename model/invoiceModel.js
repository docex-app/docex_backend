import mongoose from "mongoose";

const InvoiceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, { _id: false });


const InvoiceSchema = new mongoose.Schema({

  // 🔐 Ownership (Auth Ready)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🧾 Invoice Identity
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: ["draft", "sent", "paid", "overdue", "cancelled"],
    default: "draft"
  },

  // 📅 Dates
  invoiceDate: {
    type: Date,
    default: Date.now
  },

  dueDate: {
    type: Date,
    required: true
  },

  // 🏢 Seller
  seller: {
    name: { type: String, required: true },
    address: String,
    gstNumber: String
  },

  // 👤 Customer
  customer: {
    name: { type: String, required: true },
    email: String,
    address: String,
    gstNumber: String
  },

  // 📦 Line Items
  items: {
    type: [InvoiceItemSchema],
    required: true
  },

  // 💰 Pricing (calculated server-side)
  subTotal: {
    type: Number,
    required: true
  },

  tax: {
    type: Number,
    default: 0
  },

  discount: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  // 📝 Extras
  notes: String,
  termsAndConditions: String,

  // 📄 Delivery
  pdfUrl: String,
  emailedAt: Date,
  paidAt: Date

}, { timestamps: true });


// 🚀 Indexes for performance
InvoiceSchema.index({ userId: 1 });
InvoiceSchema.index({ invoiceNumber: 1 });

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
