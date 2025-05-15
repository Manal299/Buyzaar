
// pages/api/seller/profile.js
import connectToDatabase from '@/lib/mongoose';
import Seller from '@/models/Seller';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  await connectToDatabase();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const userId = session.user.id;

  switch (req.method) {
    case 'GET':
      try {
        const seller = await Seller.findOne({ userId });
        if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
        return res.status(200).json({ success: true, data: seller });
      } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

    case 'PUT':
      try {
        const updated = await Seller.findOneAndUpdate(
          { userId },
          req.body,
          { new: true, runValidators: true }
        );
        return res.status(200).json({ success: true, data: updated });
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
