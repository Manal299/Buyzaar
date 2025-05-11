import axios from "axios";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ✅ SSR-friendly fetch for all users
export async function getAllUsersSSR(context) {
  try {
    const res = await axios.get(`${baseUrl}/api/admin/users`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
    });
    return res.data.users;
  } catch (err) {
    console.error("Error in getAllUsersSSR:", err.message);
    return [];
  }
}

// ✅ Client-side fetch to update user (ban/promote)
export async function updateUserAction(id, action) {
  try {
    const res = await axios.put(`/api/admin/users/${id}`, { action });
    return { ok: true, data: res.data };
  } catch (err) {
    return {
      ok: false,
      data: err.response?.data || { message: "Unknown error" },
    };
  }
}


// Get top 10 products
export async function getHomeProducts(limit = 10) {
  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(limit).lean();
   console.log("Fetched products:", products);
  return JSON.parse(JSON.stringify(products));
}

// Get all products
export async function getAllProducts() {
  await connectToDB();
  const products = await Product.find({}).lean();
  console.log("Products:", products);
  return JSON.parse(JSON.stringify(products));
}

