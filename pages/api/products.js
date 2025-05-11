// pages/api/products.js
import { connectToDatabase } from "@/lib/mongoose";
import Product from "@/models/Product";

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    console.log("✅ Connected to DB");

    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find({}).limit(limit).lean();
    console.log("📦 Products fetched:", products.length);
    console.log(products);

    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
