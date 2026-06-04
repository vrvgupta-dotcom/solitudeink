import { NextResponse } from 'next/server';
import { getEditionState } from '@/lib/edition';

export async function GET() {
  const state = await getEditionState();
  return NextResponse.json(state);
}
