// pages/api/seller/products/[id].js

import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

export default async function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    let products = JSON.parse(raw);
    const productIndex = products.findIndex(p => p.id === id);

    if (method === 'GET') {
      const product = products.find(p => p.id === id);
      return product
        ? res.status(200).json(product)
        : res.status(404).json({ error: 'Not found' });
    }

    if (method === 'PUT') {
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Not found' });
      }

      const now = new Date().toISOString();

      products[productIndex] = {
        ...products[productIndex],
        title: body.title,
        price: parseFloat(body.price),
        stock: parseInt(body.stock, 10),
        imageUrl: body.imageUrl,
        updatedAt: now,
      };

      await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), 'utf-8');
      return res.status(200).json({ message: 'Updated' });
    }

    if (method === 'DELETE') {
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Not found' });
      }

      products.splice(productIndex, 1);
      await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), 'utf-8');
      return res.status(200).json({ message: 'Deleted' });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${method} not allowed` });

  } catch (err) {
    console.error('❌ API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
