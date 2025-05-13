import connectToDatabase from '../../../../lib/mongoose';
import Seller from '../../../../models/Seller';
import Order from '../../../../models/Order';
import Product from '../../../../models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // Verify authentication
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    
    // Check authorization (must be the seller or an admin)
    if (session.user.role !== 'admin' && session.user.id !== id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    await connectToDatabase();
    
    // Fetch seller information
    const seller = await Seller.findOne({ userId: id });
    
    if (!seller) {
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }
    
    // Calculate stats
    const stats = await calculateDashboardStats(seller._id);
    
    return res.status(200).json({
      success: true,
      seller,
      stats
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function calculateDashboardStats(sellerId) {
  try {
    // Calculate total revenue and order count
    const orders = await Order.find({ sellerId }).sort({ createdAt: -1 });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    
    // Get recent orders with limited data
    const recentOrders = await Order.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .lean();
    
    // Format recent orders for display
    const formattedRecentOrders = recentOrders.map(order => ({
      _id: order._id.toString(),
      createdAt: order.createdAt,
      total: order.total,
      status: order.status,
      customerName: order.userId ? order.userId.name : 'Unknown Customer'
    }));
    
    // Get product stats
    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
    const productCount = products.length;
    
    // Get recent products
    const recentProducts = await Product.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    
    // Get store rating
    const seller = await Seller.findById(sellerId);
    const storeRating = seller.storeRating || 0;
    
    return {
      totalRevenue,
      orderCount,
      productCount,
      recentOrders: formattedRecentOrders,
      recentProducts,
      storeRating
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    throw error;
  }
} 