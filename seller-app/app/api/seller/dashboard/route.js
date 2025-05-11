// app/api/seller/dashboard/route.js
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_PATH   = path.join(process.cwd(), "data", "orders.json");
const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

export async function GET(request) {
  const sellerId = request.headers.get("x-seller-id") || "";

  // load files
  const [ordersRaw, productsRaw] = await Promise.all([
    fs.readFile(ORDERS_PATH,   "utf-8"),
    fs.readFile(PRODUCTS_PATH, "utf-8"),
  ]);
  const allOrders   = JSON.parse(ordersRaw);
  const allProducts = JSON.parse(productsRaw);

  // filter by seller
  const orders   = allOrders.filter(o => o.sellerId === sellerId);
  const products = allProducts.filter(p => p.sellerId === sellerId);

  // summary
  const ordersCount   = orders.length;
  const productsCount = products.length;
  const earnings      = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // salesData for last 7 days
  const today   = new Date();
  const dates   = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const salesData = dates.map(date => {
    const dayOrders = orders.filter(o => o.createdAt.slice(0, 10) === date);
    return {
      _id:      date,
      count:    dayOrders.length,
      revenue:  dayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
    };
  });

  return NextResponse.json({
    ordersCount,
    productsCount,
    earnings,
    salesData,
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
    }
  });
}
