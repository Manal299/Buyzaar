import connectToDatabase from '@/lib/mongoose';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';



export default async function handler(req, res) {
  const { id: sellerUserId, orderId } = req.query;

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    if (session.user.role !== 'admin' && session.user.id !== sellerUserId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await connectToDatabase();

    if (req.method === 'PUT') {
      const { status } = req.body;
      const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      return res.status(200).json({ success: true, order: updatedOrder });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Order update error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
