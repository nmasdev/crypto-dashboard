import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ coin: string }> }) {
  const { coin } = await params;
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`, { next: { revalidate: 3600 } });
  if (res.ok) {
    const data = await res.json();
    return NextResponse.json(data);
  }
  return NextResponse.json({ error: res.statusText }, { status: res.status });
}
