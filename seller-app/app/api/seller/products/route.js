// app/api/seller/products/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

export async function GET(request) {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const all = JSON.parse(raw);
  const sellerId = request.headers.get('x-seller-id');
  const products = all.filter(p => p.sellerId === sellerId);
  return NextResponse.json(products);
}

export async function POST(request) {
  const sellerId = request.headers.get('x-seller-id');
  const body = await request.json();
  const now = new Date().toISOString();

  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const all = JSON.parse(raw);

  const newProduct = {
    id: uuid(),
    sellerId,
    title: body.title,
    price: parseFloat(body.price),
    stock: parseInt(body.stock, 10),
    imageUrl: body.imageUrl,
    createdAt: now,
    updatedAt: now
  };

  all.unshift(newProduct);
  await fs.writeFile(DATA_PATH, JSON.stringify(all, null, 2), 'utf-8');
  return NextResponse.json(newProduct, { status: 201 });
}
