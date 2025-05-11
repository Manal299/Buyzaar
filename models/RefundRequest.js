import mongoose from "mongoose";

const refundRequestSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: String,
  images: [String],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.models.RefundRequest || mongoose.model("RefundRequest", refundRequestSchema);
