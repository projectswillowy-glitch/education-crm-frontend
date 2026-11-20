import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(await auth.api.getSession(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
