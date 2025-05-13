import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppContext } from '@/context/AppContext';

// Chart import must be client-side only
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false
});
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Client-side only component for seller dashboard
const SellerDashboard = () => {
  const router = useRouter();
  const { user } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    recentOrders: [],
    salesData: {
      labels: [],
      datasets: []
    }
  });

  // Fetch dashboard data on client side
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/seller/dashboard', {
          headers: {
            'x-seller-id': user?._id // Pass seller ID in header
          }
        });
        
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    // Only fetch if user is loaded and is a seller
    if (user && user.role === 'seller') {
      fetchDashboardData();
    } else if (user && user.role !== 'seller') {
      router.push('/');
    }
  }, [user, router]);

  // Redirect if not authenticated or not a seller
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p>Please log in to access the seller dashboard</p>
        </div>
        <Footer />
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 md:px-16 lg:px-32 py-8">
        <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold">${dashboardData.totalRevenue.toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Orders</h3>
            <p className="text-2xl font-bold">{dashboardData.totalOrders}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Pending Orders</h3>
            <p className="text-2xl font-bold">{dashboardData.pendingOrders}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Products</h3>
            <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
          </div>
        </div>
        
        {/* Sales Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Sales Analytics</h2>
          <div className="h-80">
            <Chart
              data={dashboardData.salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Sales Trend'
                  },
                }
              }}
            />
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          
          {dashboardData.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent orders</p>
          )}
          
          <div className="mt-4 text-center">
            <button 
              onClick={() => router.push('/seller/orders')}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              View All Orders
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SellerDashboard; 