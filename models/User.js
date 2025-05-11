import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
  status: { type: String, enum: ["active", "banned", "pending"], default: "active" }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
