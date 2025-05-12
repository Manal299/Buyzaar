"use client"
import { useState } from 'react'
import useSWR from 'swr'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'

const fetcher = url => fetch(url).then(r => r.json())

export default function AnalyticsPage() {
  const { data, error } = useSWR('/api/seller/analytics', fetcher)
  const [downloading, setDownloading] = useState(false)

  if (error) return <p className="p-6 text-red-500">Failed to load analytics.</p>
  if (!data)  return <p className="p-6">Loading analytics…</p>

  const { salesData } = data

  function downloadCSV() {
    setDownloading(true)
    const header = ['Month','Revenue','Returns']
    const rows = salesData.map(d => [d.month, d.revenue.toFixed(2), d.returns.toFixed(2)])
    const csvContent =
      [header.join(','), ...rows.map(r => r.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setDownloading(false)
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Analytics & Reports</h1>

      {/* Chart Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Revenue vs Returns (last 12 months)</h2>
        <div className="w-full" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="returns" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Download CSV */}
      <button
        onClick={downloadCSV}
        disabled={downloading}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 disabled:opacity-50"
      >
        {downloading ? 'Preparing…' : 'Download CSV Report'}
      </button>
    </div>
  )
}
