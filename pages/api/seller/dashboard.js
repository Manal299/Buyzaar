import { promises as fs } from "fs";
import path from "path";

const ORDERS_PATH   = path.join(process.cwd(), "data", "orders.json");
const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const sellerId = req.headers["x-seller-id"] || "";

  const [ordersRaw, productsRaw] = await Promise.all([
    fs.readFile(ORDERS_PATH, "utf-8"),
    fs.readFile(PRODUCTS_PATH, "utf-8"),
  ]);
  const allOrders   = JSON.parse(ordersRaw);
  const allProducts = JSON.parse(productsRaw);

  const orders   = allOrders.filter(o => o.sellerId === sellerId);
  const products = allProducts.filter(p => p.sellerId === sellerId);

  const ordersCount   = orders.length;
  const productsCount = products.length;
  const earnings      = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const today = new Date();
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const salesData = dates.map(date => {
    const dayOrders = orders.filter(o => o.createdAt.slice(0, 10) === date);
    return {
      _id: date,
      count: dayOrders.length,
      revenue: dayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
    };
  });

  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
  res.status(200).json({
    ordersCount,
    productsCount,
    earnings,
    salesData,
  });
}