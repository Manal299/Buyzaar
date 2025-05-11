import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const RETURNS_PATH = path.join(process.cwd(), 'data', 'returns.json')

export async function GET() {
  const file = await fs.readFile(RETURNS_PATH, 'utf-8')
  return NextResponse.json(JSON.parse(file))
}

export async function POST(req) {
  const body = await req.json()
  const file = await fs.readFile(RETURNS_PATH, 'utf-8')
  const all = JSON.parse(file)

  const newRequest = {
    id: Date.now().toString(),
    orderId: body.orderId,
    reason: body.reason,
    image: body.image || null,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }

  all.push(newRequest)
  await fs.writeFile(RETURNS_PATH, JSON.stringify(all, null, 2))
  return NextResponse.json({ success: true })
}
