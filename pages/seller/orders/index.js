// app/seller/orders/page.jsx
"use client";

import { useState } from 'react';
import useSWR from 'swr';

const STATUSES = ["all", "pending", "shipped", "delivered", "cancelled"];

const fetcher = url =>
  fetch(url, { headers: { 'x-seller-id': 'demo-seller' } })
    .then(res => res.json());

export default function OrdersPage() {
  const { data: orders, mutate, error } = useSWR('/api/seller/orders', fetcher);
  const [filter, setFilter] = useState("all");

  if (error) return <p className="p-6 text-red-500">Failed to load orders.</p>;
  if (!orders) return <p className="p-6">Loading orders…</p>;

  // 1. Filter orders based on lowercase status match
  const filtered = filter === "all"
    ? orders
    : orders.filter(o => o.status === filter);

  // 2. Update status by calling PUT and revalidating
  async function updateStatus(id, newStatus) {
    await fetch(`/api/seller/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-seller-id': 'demo-seller'
      },
      body: JSON.stringify({ status: newStatus })
    });
    mutate(); // re-fetch
  }

  // 3. Print invoice (unchanged)
  function printInvoice(o) {
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Invoice ${o.id}</title></head><body>
      <h1>Invoice</h1>
      <p><strong>Order ID:</strong> ${o.id}</p>
      <p><strong>Date:</strong> ${new Date(o.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> ${o.status}</p>
      <h2>Items</h2><ul>
        ${o.items.map(item => `<li>${item.name} x${item.quantity} — $${item.price.toFixed(2)}</li>`).join('')}
      </ul>
      <h3>Total: $${o.totalPrice.toFixed(2)}</h3>
      </body></html>
    `);
    w.print();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Incoming Orders</h1>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
          <label htmlFor="status" className="font-medium">Filter:</label>
          <select
            id="status"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg focus:ring focus:ring-indigo-200"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <span className="text-gray-600">
          Showing <strong>{filtered.length}</strong> of <strong>{orders.length}</strong> orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID","Date","Status","Total","Actions","Print"].map(col => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? filtered.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{o.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full
                    ${o.status === 'pending'   ? 'bg-yellow-100 text-yellow-800' :
                      o.status === 'shipped'   ? 'bg-blue-100 text-blue-800' :
                      o.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                 'bg-red-100 text-red-800'}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  ${o.totalPrice.toFixed(2)}
                </td>

                {/* Actions Column: exactly one actionable button */}
                <td className="px-6 py-4 text-sm">
                  {o.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(o.id, 'shipped')}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded hover:bg-indigo-200"
                    >
                      Mark Shipped
                    </button>
                  )}
                  {o.status === 'shipped' && (
                    <button
                      onClick={() => updateStatus(o.id, 'delivered')}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {o.status === 'delivered' && (
                    <button disabled className="bg-green-200 text-green-900 px-3 py-1 rounded opacity-50 cursor-not-allowed">
                      Delivered
                    </button>
                  )}
                  {o.status === 'cancelled' && (
                    <button disabled className="bg-red-200 text-red-900 px-3 py-1 rounded opacity-50 cursor-not-allowed">
                      Cancelled
                    </button>
                  )}
                </td>

                {/* Print Column */}
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => printInvoice(o)}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
                  >
                    Print
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
