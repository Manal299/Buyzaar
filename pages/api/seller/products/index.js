// pages/api/seller/products/index.js

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

export default async function handler(req, res) {
  const sellerId = req.headers['x-seller-id'];

  if (!sellerId) {
    return res.status(400).json({ error: "Missing seller ID in headers." });
  }

  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    const all = JSON.parse(raw);

    if (req.method === 'GET') {
      const products = all.filter(p => p.sellerId === sellerId);
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const body = req.body;
      const now = new Date().toISOString();

      const newProduct = {
        id: uuid(),
        sellerId,
        title: body.title,
        price: parseFloat(body.price),
        stock: parseInt(body.stock, 10),
        imageUrl: body.imageUrl,
        createdAt: now,
        updatedAt: now,
      };

      all.unshift(newProduct);
      await fs.writeFile(DATA_PATH, JSON.stringify(all, null, 2), 'utf-8');

      return res.status(201).json(newProduct);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });

  } catch (err) {
    console.error("❌ Error handling products API:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
