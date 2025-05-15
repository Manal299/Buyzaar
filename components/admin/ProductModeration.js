"use client";

import useSWR from "swr";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function ProductModeration() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR("/api/admin/products", fetcher);
  const [updatingId, setUpdatingId] = useState(null);

  if (error) return <p className="text-red-500">Failed to load products.</p>;
  if (!data) return <p className="text-gray-600">Loading pending products...</p>;

  const products = data.products || [];

  async function handleAction(productId, status) {
    setUpdatingId(productId);
    await fetch(`/api/admin/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdatingId(null);
    mutate();
  }

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Moderate Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No pending products to moderate.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">Product</th>
                <th className="text-left px-4 py-2">Price</th>
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-left px-4 py-2">Seller</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-gray-600">{p.seller?.name || "Unknown"}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleAction(p._id, "approved")}
                      disabled={updatingId === p._id}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(p._id, "rejected")}
                      disabled={updatingId === p._id}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
