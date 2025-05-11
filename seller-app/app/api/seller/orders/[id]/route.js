// app/api/seller/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'orders.json');

export async function PUT(request, { params }) {
  const { status } = await request.json();
  if (!['pending','shipped','delivered','cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const all = JSON.parse(raw);

  let updated = false;
  const newData = all.map(o => {
    if (o.id === params.id) {
      updated = true;
      return { ...o, status, updatedAt: new Date().toISOString() };
    }
    return o;
  });

  if (!updated) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(newData, null, 2), 'utf-8');
  return NextResponse.json({ message: 'Status updated' });
}
