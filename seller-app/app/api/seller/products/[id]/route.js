// app/api/seller/products/[id]/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

export async function GET(request, { params }) {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const all = JSON.parse(raw);
  const prod = all.find(p => p.id === params.id);
  return prod
    ? NextResponse.json(prod)
    : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const now = new Date().toISOString();

  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  let all = JSON.parse(raw);

  let found = false;
  all = all.map(p => {
    if (p.id === params.id) {
      found = true;
      return {
        ...p,
        title: body.title,
        price: parseFloat(body.price),
        stock: parseInt(body.stock, 10),
        imageUrl: body.imageUrl,
        updatedAt: now
      };
    }
    return p;
  });

  if (!found) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(all, null, 2), 'utf-8');
  return NextResponse.json({ message: 'Updated' });
}

export async function DELETE(request, { params }) {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const all = JSON.parse(raw);
  const filtered = all.filter(p => p.id !== params.id);

  if (filtered.length === all.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
  return NextResponse.json({ message: 'Deleted' });
}
