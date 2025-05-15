import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const { id: sellerId } = req.query;
  await connectToDatabase();

  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user.id !== sellerId && session.user.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        const filter = { sellerId };

        if (category) filter.category = category;

        if (minPrice || maxPrice) {
          filter.price = {};
          if (minPrice) filter.price.$gte = Number(minPrice);
          if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 });

        return res.status(200).json({
          success: true,
          data: products,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }

    case 'POST': {
      try {
        const { name, description, price, images, category } = req.body;
        if (!name || !description || !price || !images || !category) {
          return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        const productImages = Array.isArray(images) ? images : [images];

        const product = await Product.create({
          ...req.body,
          subcategory: undefined, // Optional: ensure it's removed
          images: productImages,
          sellerId,
        });

        return res.status(201).json({ success: true, data: product });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
