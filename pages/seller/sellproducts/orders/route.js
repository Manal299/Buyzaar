// app/api/seller/orders/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'orders.json');

export async function GET(request) {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const all = JSON.parse(raw);
  const sellerId = request.headers.get('x-seller-id') || '';
  const orders = all.filter(o => o.sellerId === sellerId);
  return NextResponse.json(orders);
}
