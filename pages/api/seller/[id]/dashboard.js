import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    // ✅ Only logged-in sellers can access
    if (!session || session.user.role !== 'seller') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    await connectToDatabase();

    const userId = session.user.id;

    // ✅ Get recent orders for this seller
    const orders = await Order.find({ sellerId: userId }).sort({ createdAt: -1 });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;

    const recentOrders = await Order.find({ sellerId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .lean();

    const formattedOrders = recentOrders.map(order => ({
      _id: order._id.toString(),
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      customerName: order.userId?.name || 'Unknown'
    }));

    // ✅ Get seller products
    const products = await Product.find({ sellerId: userId }).sort({ createdAt: -1 });
    const productCount = products.length;

    const recentProducts = await Product.find({ sellerId: userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // 📊 Sales Chart Data
    const getLast7Days = () => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split("T")[0]); // Format: "YYYY-MM-DD"
      }
      return days;
    };

    const revenueByDay = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      revenueByDay[date] = (revenueByDay[date] || 0) + order.total;
    });

    const salesData = getLast7Days().map(date => ({
      _id: date,
      revenue: revenueByDay[date] || 0
    }));

    return res.status(200).json({
      success: true,
      seller: {
        storeName: session.user.sellerInfo?.storeName || "Your Store"
      },
      stats: {
        totalRevenue,
        orderCount,
        productCount,
        recentOrders: formattedOrders,
        recentProducts,
        storeRating: session.user.sellerInfo?.storeRating || 0
      },
      salesData
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
