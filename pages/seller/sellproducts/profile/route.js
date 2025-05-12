import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const PROFILE_PATH = path.join(process.cwd(), 'data', 'sellerProfile.json')

export async function GET() {
  const raw = await fs.readFile(PROFILE_PATH, 'utf-8')
  const profile = JSON.parse(raw)
  return NextResponse.json(profile)
}
