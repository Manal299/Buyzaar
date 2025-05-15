import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  await connectToDatabase();

  const products = await Product.find({ isActive: true, status: 'pending' })
    .populate('sellerId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const result = products.map((p) => ({
    _id: p._id,
    name: p.name,
    price: p.price,
    category: p.category,
    seller: p.sellerId ? { name: p.sellerId.name, email: p.sellerId.email } : null,
  }));

  res.status(200).json({ success: true, products: result });
}
