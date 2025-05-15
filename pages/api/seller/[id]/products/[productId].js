import connectToDatabase from '@/lib/mongoose';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { id: sellerId, productId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  await connectToDatabase();

  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user.id !== sellerId && session.user.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findOne({ _id: productId, sellerId });
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        return res.status(200).json({ success: true, data: product });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

    case 'PUT':
      try {
        const updates = {
          ...req.body,
          images: Array.isArray(req.body.images) ? req.body.images : [req.body.images || []],
          sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes || []],
          colors: Array.isArray(req.body.colors) ? req.body.colors : [req.body.colors || []],
          price: parseFloat(req.body.price),
          stock: parseInt(req.body.stock, 10),
          inventory: parseInt(req.body.inventory, 10),
          isActive: !!req.body.isActive,
        };

        const product = await Product.findOneAndUpdate(
          { _id: productId, sellerId },
          updates,
          { new: true, runValidators: true }
        );

        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }

        return res.status(200).json({ success: true, data: product });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

    case 'DELETE':
      try {
        const deleted = await Product.findOneAndDelete({ _id: productId, sellerId });
        if (!deleted) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        return res.status(200).json({ success: true, data: {} });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      case 'POST': {
      try {
        const { name, description, price, stock, category, images, sizes, colors, inventory, isActive } = req.body;

        if (!name || !description || !price || !stock || !category || !images || images.length === 0) {
          return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newProduct = await Product.create({
          name,
          description,
          price,
          stock,
          category,
          images: Array.isArray(images) ? images : [images],
          sizes: Array.isArray(sizes) ? sizes : (sizes ? [sizes] : []),
          colors: Array.isArray(colors) ? colors : (colors ? [colors] : []),
          inventory: inventory ?? 0,
          isActive: isActive ?? true,
          sellerId,
        });

        return res.status(201).json({ success: true, data: newProduct });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
      return res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
}
