// seller-dashboard-home.js
"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { AlertCircle, PackageCheck, TrendingUp, DollarSign } from "lucide-react";
import SellerSidebar from "@/components/seller/SellerSidebar";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getLabelsWithDates = () => {
  const today = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const labels = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = `${days[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`;
    labels.push(label);
  }

  return labels;
};

const dashboardData = {
  labels: getLabelsWithDates(),
  datasets: [
    {
      label: "Sales",
      data: [120, 190, 300, 500, 200, 300, 400],
      borderColor: "rgba(99, 102, 241, 1)",
      backgroundColor: "rgba(99, 102, 241, 0.2)",
      tension: 0.3,
    },
  ],
};

export default function SellerDashboardHome() {
  const sellerName = "Elegant Fashions";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome Back, {sellerName}!</h1>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
            <DollarSign className="text-amber-500" />
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-xl font-semibold">$5,200</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
            <TrendingUp className="text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Today’s Sales</p>
              <p className="text-xl font-semibold">$350</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
            <PackageCheck className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-xl font-semibold">4</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
            <AlertCircle className="text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-xl font-semibold">2 Products</p>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Sales This Week</h2>
          <Line data={dashboardData} />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button className="px-4 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">View All</button>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between border-b pb-2">
              <span>Order #12345</span>
              <span className="text-green-600 font-medium">Shipped</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span>Order #12346</span>
              <span className="text-yellow-600 font-medium">Processing</span>
            </li>
            <li className="flex justify-between">
              <span>Order #12347</span>
              <span className="text-red-600 font-medium">Pending</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
