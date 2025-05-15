// components/seller/DashboardMain.js
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
} from "recharts";

export default function DashboardMain({ data }) {
  const { seller, stats, salesData } = data;
  console.log("Dashboard Data:", seller);
  const sales7d = (stats?.recentOrders || []).reduce((sum, p) => sum + p.total, 0);

  const cards = [
    { label: "Total Earnings", value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, bg: "from-green-400 to-green-600" },
    { label: "Total Orders", value: stats?.orderCount ?? 0, bg: "from-blue-400 to-blue-600" },
    { label: "Total Products", value: stats?.productCount ?? 0, bg: "from-purple-400 to-purple-600" },
    { label: "Sales (7d)", value: `$${sales7d.toFixed(2)}`, bg: "from-yellow-400 to-yellow-600" },
  ];

  return (
    <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-auto">
      <h1 className="text-2xl font-bold">Welcome Back, {seller?.storeName || "Seller"}!</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, bg }) => (
          <div key={label} className={`bg-gradient-to-br ${bg} text-white p-5 rounded-xl shadow-lg`}>
            <div className="text-sm opacity-90 uppercase font-medium">{label}</div>
            <div className="mt-3 text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {stats?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>Order ID</th><th>Date</th><th>Customer</th><th>Amount</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="py-2">#{order._id.slice(-6)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.customerName}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-500">No recent orders</p>}
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Products</h2>
        {stats?.recentProducts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentProducts.map(product => (
              <div key={product._id} className="border rounded-lg bg-gray-50 overflow-hidden">
                <div className="h-40 bg-gray-200">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-xs mb-2">{product.category}</p>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                    <span className="text-gray-600">Stock: {product.inventory}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500">No products added yet</p>}
      </section>

      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Revenue</h2>
        <div className="w-full" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                isAnimationActive={!!salesData?.length}
              />
            </LineChart>
          </ResponsiveContainer>
          {!salesData?.length && (
            <div className="text-center text-gray-400 mt-4">No data available</div>
          )}
        </div>
      </section>
    </main>
  );
}
