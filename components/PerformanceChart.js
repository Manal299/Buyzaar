// components/PerformanceChart.jsx
"use client";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid
} from "recharts";

export default function PerformanceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
