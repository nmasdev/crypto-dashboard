import { NextResponse } from 'next/server';

// duration should only be one of "24h" | "7d" | "30d" | "1y"
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vs_currency = searchParams.get("vs_currency") ?? "usd";
  const duration = searchParams.get("duration") ?? "24h";
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/top_gainers_losers?vs_currency=${vs_currency}&duration=${duration}&per_page=10&page=1`, { next: { revalidate: 300 } });
  const data = await res.json();

  const index = vs_currency + `_${duration}_change`;

  const formatted_gainers = await data.top_gainers
    .sort((a: any, b: any) => b[index] - a[index])
    .slice(0, 10)
    .map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      image: coin.image,
      market_cap_rank: coin.market_cap_rank,
      change: coin[index],
    }));

  const formatted_losers = await data.top_losers
    .sort((a: any, b: any) => b[index] - a[index])
    .slice(0, 10)
    .map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      image: coin.image,
      market_cap_rank: coin.market_cap_rank,
      change: coin[index],
    }));

  return NextResponse.json({ gainers: formatted_gainers, losers: formatted_losers });
}
