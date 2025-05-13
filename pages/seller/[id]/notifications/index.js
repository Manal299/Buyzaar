"use client";

import useSWR from 'swr';
import { useState } from 'react';
import { Bell, Trash2, CheckCircle2, Filter } from 'lucide-react';
import SellerSidebar from '@/components/seller/SellerSidebar';

const fetcher = url => fetch(url, { headers: { 'x-seller-id': 'demo-seller' } }).then(res => res.json());

export default function SellerNotificationsPage() {
  const { data: notifications, error, mutate } = useSWR('/api/seller/notifications', fetcher);
  const [filter, setFilter] = useState('all');

  if (error) return <p className="p-6 text-red-500">Failed to load notifications.</p>;
  if (!notifications) return <p className="p-6">Loading notifications…</p>;

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  async function markAllRead() {
    await fetch('/api/seller/notifications/mark-all-read', {
      method: 'POST',
      headers: { 'x-seller-id': 'demo-seller' }
    });
    mutate();
  }

  async function deleteAll() {
    if (!confirm('Delete all notifications?')) return;
    await fetch('/api/seller/notifications', {
      method: 'DELETE',
      headers: { 'x-seller-id': 'demo-seller' }
    });
    mutate();
  }

  async function markAsRead(id) {
    await fetch(`/api/seller/notifications/${id}/read`, {
      method: 'POST',
      headers: { 'x-seller-id': 'demo-seller' }
    });
    mutate();
  }

  async function deleteOne(id) {
    await fetch(`/api/seller/notifications/${id}`, {
      method: 'DELETE',
      headers: { 'x-seller-id': 'demo-seller' }
    });
    mutate();
  }

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <div className="flex-1 bg-gray-100 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <div className="flex gap-3">
            <button onClick={markAllRead} className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-200">
              <CheckCircle2 className="inline w-4 h-4 mr-1" /> Mark All Read
            </button>
            <button onClick={deleteAll} className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-200">
              <Trash2 className="inline w-4 h-4 mr-1" /> Delete All
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="text-gray-500" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border px-3 py-2 rounded-lg text-sm">
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="order">Order Updates</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No notifications to show.</div>
          ) : (
            filtered.map(n => (
              <div key={n.id} className={`flex justify-between items-start p-4 bg-white shadow rounded-xl border-l-4 ${
                n.type === 'order' ? 'border-indigo-400' : 'border-gray-300'
              }`}>
                <div>
                  <p className={`text-sm ${n.read ? 'text-gray-500' : 'text-gray-800 font-semibold'}`}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex gap-3 items-center">
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="text-xs text-indigo-600 hover:underline">Mark as Read</button>
                  )}
                  <button onClick={() => deleteOne(n.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
