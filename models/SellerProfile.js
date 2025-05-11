import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  storeName: String,
  storeDescription: String,
  logo: String,
  approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  socialLinks: [String],
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SellerProfile || mongoose.model("SellerProfile", sellerProfileSchema);
