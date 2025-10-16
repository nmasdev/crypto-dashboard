import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ coin: string }> }) {
  const { coin } = await params;
  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") ?? "7";
  const vs_currency = searchParams.get("vs_currency") ?? "usd";
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${vs_currency}&days=${days}`, { next: { revalidate: 3600 } });
  if (res.ok) {
    const data = await res.json();
    let formatted;
    if (data.prices) {
      formatted = await data.prices.map((p: [number, number]) => ({
        time: p[0],
        price: p[1],
      }));
    }
    return NextResponse.json(formatted ?? null);
  }
  return NextResponse.json({ error: res.statusText}, { status: res.status });
}
