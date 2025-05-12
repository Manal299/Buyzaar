// pages/api/returns/index.js

import fs from 'fs/promises';
import path from 'path';

const RETURNS_PATH = path.join(process.cwd(), 'data', 'returns.json');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const file = await fs.readFile(RETURNS_PATH, 'utf-8');
      return res.status(200).json(JSON.parse(file));
    } catch (err) {
      console.error('❌ GET /returns failed:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const file = await fs.readFile(RETURNS_PATH, 'utf-8');
      const all = JSON.parse(file);

      const newRequest = {
        id: Date.now().toString(),
        orderId: body.orderId,
        reason: body.reason,
        image: body.image || null,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      all.push(newRequest);
      await fs.writeFile(RETURNS_PATH, JSON.stringify(all, null, 2), 'utf-8');

      return res.status(201).json({ success: true });
    } catch (err) {
      console.error('❌ POST /returns failed:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
