"use client";

import useSWR from "swr";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminAnalytics() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/admin/analytics", fetcher);

  if (error) return <p className="text-red-500">Failed to load analytics.</p>;
  if (!data) return <p className="text-gray-600">Loading analytics...</p>;

  const { totalRevenue, totalOrders, averageOrderValue, signups } = data;

  return (
    <div className="bg-white shadow rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Platform Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-xl font-bold text-indigo-700">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-xl font-bold text-green-700">{totalOrders}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Avg Order Value</p>
          <p className="text-xl font-bold text-yellow-700">${averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">User Signups (Last 7 Days)</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={signups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
