import { connectToDatabase } from '@/lib/db';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connectToDatabase();

  const sellerId = req.headers['x-seller-id'];
  if (!sellerId) return res.status(400).json({ error: 'Missing seller ID' });

  if (req.method === 'GET') {
    const products = await Product.find({ sellerId }).sort({ updatedAt: -1 });
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const { title, description, price, stock, categoryId, images } = req.body;

    const newProduct = await Product.create({
      sellerId,
      title,
      description,
      price,
      stock,
      categoryId: categoryId || null,
      images: images || [],
    });

    return res.status(201).json(newProduct);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
