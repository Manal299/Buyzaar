// app/seller/orders/page.jsx
"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { ShoppingCart, Search, X, Pencil } from 'lucide-react';
import SellerSidebar from '@/components/seller/SellerSidebar';
const STATUSES = ["all", "pending", "shipped", "delivered", "cancelled"];

const fetcher = url =>
  fetch(url, { headers: { 'x-seller-id': 'demo-seller' } }).then(res => res.json());

export default function OrdersPage() {
  const { data: orders, mutate, error } = useSWR('/api/seller/orders', fetcher);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const today = new Date().toDateString();

  if (error) return <p className="p-6 text-red-500">Failed to load orders.</p>;
  if (!orders) return <p className="p-6">Loading orders…</p>;

  const filtered = orders.filter(o => filter === "all" || o.status === filter);
  const searched = search.trim()
    ? filtered.filter(o => o.customer?.toLowerCase().includes(search.toLowerCase()))
    : filtered;

  async function updateStatus(id, newStatus) {
    await fetch(`/api/seller/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-seller-id': 'demo-seller'
      },
      body: JSON.stringify({ status: newStatus })
    });
    mutate();
  }

  async function saveEdits(id) {
    setIsSaving(true);
    setSaveError(false);
    try {
      const res = await fetch(`/api/seller/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-seller-id': 'demo-seller'
        },
        body: JSON.stringify(edited)
      });
      if (!res.ok) throw new Error("Failed to save");

      setSaveSuccess(true);
      mutate();
      setTimeout(() => {
        setSaveSuccess(false);
        setSelectedOrder(null);
        setIsEditing(false);
        setEdited({});
      }, 1500);
    } catch (err) {
      console.error(err);
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  }

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
 <div className="flex min-h-screen">
    <SellerSidebar />

    <div className="flex-1 bg-gray-100 p-6  space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">Incoming Orders</h1>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="status" className="font-medium text-gray-700">Filter:</label>
          <select
            id="status"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <span className="text-gray-600 text-sm">
          Showing <strong>{searched.length}</strong> of <strong>{orders.length}</strong> orders
        </span>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              {["ID", "Date", "Status", "Total", "Actions", "Print"].map(col => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {searched.length > 0 ? searched.map(o => (
              <tr
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`cursor-pointer hover:bg-gray-50 ${
                  new Date(o.createdAt).toDateString() === today ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{o.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${o.status === 'pending'   ? 'bg-yellow-100 text-yellow-800' :
                      o.status === 'shipped'   ? 'bg-blue-100 text-blue-800' :
                      o.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                 'bg-red-100 text-red-800'}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                  ${o.totalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
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
                    <span className="bg-green-200 text-green-900 px-3 py-1 rounded text-xs font-medium">Delivered</span>
                  )}
                  {o.status === 'cancelled' && (
                    <span className="bg-red-200 text-red-900 px-3 py-1 rounded text-xs font-medium">Cancelled</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <button
              onClick={() => {
                setSelectedOrder(null);
                setIsEditing(false);
                setEdited({});
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Order #{selectedOrder.id}</h2>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEdited({
                    customer: selectedOrder.customer || '',
                    contact: selectedOrder.contact || '',
                    address: selectedOrder.address || '',
                    notes: selectedOrder.notes || ''
                  });
                }}
                className="text-sm text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <Pencil size={16} /> Edit
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block font-medium text-gray-700">Customer:</label>
                    <input value={edited.customer} onChange={(e) => setEdited({ ...edited, customer: e.target.value })} className="w-full border rounded px-2 py-1 mt-1" />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">Contact:</label>
                    <input value={edited.contact} onChange={(e) => setEdited({ ...edited, contact: e.target.value })} className="w-full border rounded px-2 py-1 mt-1" />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">Address:</label>
                    <textarea value={edited.address} onChange={(e) => setEdited({ ...edited, address: e.target.value })} className="w-full border rounded px-2 py-1 mt-1" />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">Notes:</label>
                    <textarea value={edited.notes} onChange={(e) => setEdited({ ...edited, notes: e.target.value })} className="w-full border rounded px-2 py-1 mt-1" />
                  </div>
                  <button onClick={() => saveEdits(selectedOrder.id)} className="mt-3 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700">
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Customer:</strong> {selectedOrder.customer || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Contact:</strong> {selectedOrder.contact || 'Not provided'}</p>
                  <p><strong>Address:</strong> {selectedOrder.address || 'Not provided'}</p>
                  {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
                </>
              )}
              {saveSuccess && <p className="text-green-600 text-sm pt-2">Saved successfully!</p>}
              {saveError && <p className="text-red-600 text-sm pt-2">Failed to save changes. Please try again.</p>}
            </div>

            <ul className="text-sm space-y-2">
              {selectedOrder.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <hr className="my-4" />
            <div className="flex justify-between text-sm font-semibold">
              <span>Total:</span>
              <span>${selectedOrder.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
