// pages/api/seller/orders/[id].js

import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "orders.json");

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { status } = req.body;
      const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const raw = await fs.readFile(DATA_PATH, "utf-8");
      const allOrders = JSON.parse(raw);

      let updated = false;
      const updatedOrders = allOrders.map(order => {
        if (order.id === id) {
          updated = true;
          return { ...order, status, updatedAt: new Date().toISOString() };
        }
        return order;
      });

      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }

      await fs.writeFile(DATA_PATH, JSON.stringify(updatedOrders, null, 2), "utf-8");
      return res.status(200).json({ message: "Status updated" });

    } catch (err) {
      console.error("Error updating order:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
