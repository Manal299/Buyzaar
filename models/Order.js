import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  paymentMethod: { type: String, enum: ["COD", "Card", "PayPal"], default: "COD" },
  paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
