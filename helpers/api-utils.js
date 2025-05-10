import axios from "axios";

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
