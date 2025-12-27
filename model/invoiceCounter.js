import mongoose from "mongoose";

const invoiceCounterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    currentInvoiceNumber: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("InvoiceCounter", invoiceCounterSchema);
