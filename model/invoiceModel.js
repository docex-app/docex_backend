import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    invoiceNumber: {
      type: Number,
      required: true
    },

    seller: {
      name: String,
      address: String,
      email: String,
      phone: String,
      gst: String
    },

    client: {
      name: String,
      address: String,
      email: String,
      phone: String,
      phone: String,
      gst: String
    },

    items: [invoiceItemSchema],

    subtotal: { type: Number, required: true },
    taxPercent: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["draft", "final"],
      default: "draft"
    },

    pdfPath: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Ensure invoice number is unique per user
invoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true });

export default mongoose.model("Invoice", invoiceSchema);
