import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const RETURNS_PATH = path.join(process.cwd(), 'data', 'returns.json')

export async function PATCH(req, { params }) {
  const { id } = params
  const body = await req.json()
  const all = JSON.parse(await fs.readFile(RETURNS_PATH, 'utf-8'))
  const idx = all.findIndex(r => r.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  all[idx].status = body.status
  await fs.writeFile(RETURNS_PATH, JSON.stringify(all, null, 2))
  return NextResponse.json({ success: true })
}
