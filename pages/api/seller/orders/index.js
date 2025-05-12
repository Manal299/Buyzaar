// pages/api/seller/orders/index.js

import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'orders.json');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const raw = await fs.readFile(DATA_PATH, 'utf-8');
      const all = JSON.parse(raw);
      const sellerId = req.headers['x-seller-id'] || '';
      const orders = all.filter(order => order.sellerId === sellerId);
      return res.status(200).json(orders);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
