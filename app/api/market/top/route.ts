import { NextResponse } from 'next/server';

const count = 20;
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vs_currency = searchParams.get("vs_currency") ?? "usd";
  const page = searchParams.get("page") ?? "1";
  const ids = searchParams.get("ids") ?? "";
  return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${count}&page=${page}&price_change_percentage=24h,7d,30d${ids ? "&ids=" + ids.toString() : ""}`, { next: { revalidate: 300 } })
    .then((res) => res.json())
    .then((jsonData) => 
       jsonData.sort((a: any, b: any) => b.current_price - a.current_price)
        .slice(0, count)
        .map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          image: coin.image,
          volume: coin.total_volume,
          market_cap: coin.market_cap,
          price_change_24h: coin.price_change_24h,
          price_change_percentage_24h: coin.price_change_percentage_24h_in_currency,
          price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
          price_change_percentage_30d: coin.price_change_percentage_30d_in_currency,
        }))
    )
    .then((formatted) => NextResponse.json(formatted))
    .catch((err) => {
      console.error("Error fetching data:", err);
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  });
}
