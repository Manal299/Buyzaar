// pages/api/sales/index.js

import fs from "fs/promises";
import path from "path";

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf-8");
    const all = JSON.parse(raw);
    const sellerOrders = all.filter(o => o.sellerId === "demo-seller");

    // Build last 12 months labels
    const now = new Date();
    const months = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });

    // Initialize data
    const salesData = months.map(m => ({ month: m, revenue: 0, returns: 0 }));

    // Aggregate
    sellerOrders.forEach(o => {
      const m = o.createdAt.slice(0, 7); // “YYYY-MM”
      const idx = months.indexOf(m);
      if (idx >= 0) {
        if (o.status === "cancelled") {
          salesData[idx].returns += o.totalPrice;
        } else {
          salesData[idx].revenue += o.totalPrice;
        }
      }
    });

    res.status(200).json({ salesData });
  } catch (error) {
    console.error("Error reading sales data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
