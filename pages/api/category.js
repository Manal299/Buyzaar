// pages/api/categories/index.js

import connectToDatabase from '@/lib/mongoose';
import Category from '@/models/Category';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const categories = await Category.find({});
      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
