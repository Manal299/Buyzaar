"use client";
import Link from "next/link";
import useSWR from "swr";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid
} from "recharts";

const fetcher = url =>
  fetch(url, { headers: { "x-seller-id": "demo-seller" } })
    .then(res => res.json());

export default function DashboardPage() {
  const { data, error } = useSWR("/api/seller/dashboard", fetcher);
 
  if (error) return <p className="p-6 text-red-500">Failed to load dashboard.</p>;
  if (!data)   return <p className="p-6">Loading dashboard…</p>;
  console.log("data", data);
  const { ordersCount, productsCount, earnings, salesData } = data;
  const sales7d = salesData.reduce((sum, p) => sum + p.count, 0);

  const cards = [
    {
      label: "Total Earnings",
      value: `$${earnings.toFixed(2)}`,
      bg: "from-green-400 to-green-600",
    },
    {
      label: "Total Orders",
      value: ordersCount,
      bg: "from-blue-400 to-blue-600",
    },
    {
      label: "Total Products",
      value: productsCount,
      bg: "from-purple-400 to-purple-600",
    },
    {
      label: "Sales (7d)",
      value: sales7d,
      bg: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/seller/dashboard" className="font-semibold text-gray-800">Dashboard</Link>
        <span className="mx-2">&raquo;</span> Home
      </nav>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, bg }) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${bg} text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between`}
          >
            <p className="uppercase text-sm font-medium opacity-90">{label}</p>
            <p className="mt-4 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Revenue</h2>
        <div className="w-full" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
