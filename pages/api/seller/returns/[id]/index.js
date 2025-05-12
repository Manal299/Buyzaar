// pages/api/returns/[id]/index.js

import fs from 'fs/promises';
import path from 'path';

const RETURNS_PATH = path.join(process.cwd(), 'data', 'returns.json');

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { id } = req.query;

    try {
      const body = req.body;
      const all = JSON.parse(await fs.readFile(RETURNS_PATH, 'utf-8'));
      const idx = all.findIndex(r => r.id === id);

      if (idx === -1) {
        return res.status(404).json({ error: 'Not found' });
      }

      all[idx].status = body.status;
      await fs.writeFile(RETURNS_PATH, JSON.stringify(all, null, 2), 'utf-8');

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ PATCH /returns/[id] failed:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
