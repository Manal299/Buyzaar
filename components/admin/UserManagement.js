"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2, ShieldCheck, ShieldX, Ban, Undo2 } from "lucide-react";

export default function UserManagement() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR("/api/admin/users", fetcher);
  const [updating, setUpdating] = useState(null);

  if (error) return <p className="text-red-500">Failed to load users.</p>;
  if (!data) return <p className="text-gray-600">Loading users...</p>;

  const users = data.users || [];

  async function updateUser(id, updates) {
    setUpdating(id);
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setUpdating(null);
    mutate();
  }

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{user.name}</td>
                <td className="px-4 py-2 text-gray-600">{user.email}</td>
                <td className="px-4 py-2 capitalize">
                  <select
                    className="border px-2 py-1 rounded"
                    value={user.role}
                    disabled={updating === user._id}
                    onChange={(e) => updateUser(user._id, { role: e.target.value })}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "banned"
                        ? "bg-red-100 text-red-800"
                        : user.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  {user.status !== "banned" ? (
                    <button
                      onClick={() => updateUser(user._id, { status: "banned" })}
                      disabled={updating === user._id}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Ban className="w-4 h-4" /> Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => updateUser(user._id, { status: "active" })}
                      disabled={updating === user._id}
                      className="text-green-600 hover:underline flex items-center gap-1"
                    >
                      <Undo2 className="w-4 h-4" /> Unban
                    </button>
                  )}
                  {updating === user._id && (
                    <Loader2 className="animate-spin w-4 h-4 text-gray-400 inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
