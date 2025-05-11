import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true },
  minPurchaseAmount: Number,
  expiresAt: Date
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
