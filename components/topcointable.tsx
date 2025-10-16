"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { currencyFormat, percentFormat, shortCurrencyFormat } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCurrency } from "app/context/CurrencyContext";
import { Button } from "./ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSavedCoinsContext } from "app/context/SavedCoinsContext";

type TopCoinData = {
  id: string,
  name: string,
  symbol: string,
  price: number,
  image: string,
  volume: number,
  market_cap: number,
  price_change_24h: number,
  price_change_percentage_24h: number,
  price_change_percentage_7d: number,
  price_change_percentage_30d: number,
};

type TopCoinTableProps = {
  usingCoinList?: boolean;
};

export default function TopCoins({
  usingCoinList = false
}: TopCoinTableProps) {
  const { savedCoins, toggleCoin } = useSavedCoinsContext();
  const router = useRouter();
  const [data, setData] = useState<TopCoinData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);
  const { currency } = useCurrency();

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/market/top?vs_currency=${currency}&page=${page}${usingCoinList && savedCoins.length > 0 ? "&ids=" + savedCoins.toString() : ""}`);
    const json = await res.json();
    if (json.error) {
      setData([]);
      console.error(json.error);
      setError(true)
    } else {
      setData(json);
    }
  }, [currency, page, usingCoinList, savedCoins]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!error) {
    return (
      <div>
        {!usingCoinList || savedCoins.length > 0
          ? <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">24H</TableHead>
                <TableHead className="text-right">%24H</TableHead>
                <TableHead className="text-right">%7D</TableHead>
                <TableHead className="text-right">%1M</TableHead>
                <TableHead className="text-right">Saved</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((coin, i) => (
                <TableRow
                  key={coin.id}
                  onClick={() => router.push(`/chart/${coin.id}`)}
                  className="cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2"><img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full"></img> {coin.name} <span className="font-normal font-mono">{coin.symbol.toUpperCase()}</span></TableCell>
                  <TableCell className="text-right">{currencyFormat(currency, coin.price)}</TableCell>
                  <TableCell className="text-right">{shortCurrencyFormat(currency, coin.market_cap)}</TableCell>
                  <TableCell className="text-right">{shortCurrencyFormat(currency, coin.volume)}</TableCell>
                  <TableCell className={(coin.price_change_24h == 0 ? "text-black" : coin.price_change_24h > 0 ? "text-green-600" : "text-red-600") + " text-right"}>{currencyFormat(currency, coin.price_change_24h)}</TableCell>
                  <TableCell className={(coin.price_change_percentage_24h == 0 ? "text-black" : coin.price_change_percentage_24h > 0 ? "text-green-600" : "text-red-600") + " text-right"}>{percentFormat(coin.price_change_percentage_24h)}</TableCell>
                  <TableCell className={(coin.price_change_percentage_7d == 0 ? "text-black" : coin.price_change_percentage_7d > 0 ? "text-green-600" : "text-red-600") + " text-right"}>{percentFormat(coin.price_change_percentage_7d)}</TableCell>
                  <TableCell className={(coin.price_change_percentage_30d == 0 ? "text-black" : coin.price_change_percentage_30d > 0 ? "text-green-600" : "text-red-600") + " text-right"}>{percentFormat(coin.price_change_percentage_30d)}</TableCell>
                  <TableCell className="text-right" onClick={(e) => { e.stopPropagation(); toggleCoin(coin.id) }}>{savedCoins.includes(coin.id) ? <BookmarkCheck className="inline-block" /> : <Bookmark className="inline-block" />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          : <p>No cryptocurrencies saved to watchlist.</p>}
        {savedCoins.length > 0 &&
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page}
            </span>

            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={data.length < 10}
            >
              Next
            </Button>
          </div>
        }
      </div>
    );
  }
  else {
    return <div className="flex h-full flex-col items-center justify-center">
      <h4>Something went wrong, please wait and try again.</h4>
    </div>
  }
}

export { TopCoins };