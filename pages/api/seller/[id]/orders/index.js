import connectToDatabase from '@/lib/mongoose';
import Seller from '@/models/Seller';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    await connectToDatabase();

    // Always use session.user.id for data lookup
    const currentUserId = session.user.id;

    // Only allow admins to access other sellers' data
    if (session.user.role !== 'admin' && id !== currentUserId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    // Get seller info
    const seller = await Seller.findOne({ userId: currentUserId });
    if (!seller) {
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }

    // 🛒 Orders with customer info
    const orders = await Order.find({ sellerId: currentUserId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email') // ✅ Only addition made here
      .lean();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const orderCount = orders.length;

    const recentOrders = orders.slice(0, 5).map(o => ({
      id: o._id.toString(),
      createdAt: o.createdAt || new Date(),
      status: o.status || 'pending',
      totalPrice: o.total || 0,
      customer: {
        name: o.userId?.name || 'Unknown',
        email: o.userId?.email || 'N/A'
      },
      items: (o.items || []).map(item => ({
        name: item.productId?.toString() || 'Unknown Product',
        quantity: item.quantity || 0,
        price: item.price || 0,
      }))
    }));

    // 🧾 Product Info
    const products = await Product.find({ sellerId: currentUserId }).sort({ createdAt: -1 }).lean();
    const productCount = products.length;
    const recentProducts = products.slice(0, 6);

    const storeRating = seller.storeRating || 0;

    return res.status(200).json({
      success: true,
      seller: {
        ...seller.toObject(),
        stats: {
          totalRevenue,
          orderCount,
          productCount,
          recentOrders,
          recentProducts,
          storeRating
        }
      }
    });

  } catch (error) {
    console.error('Error in full seller data API:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
