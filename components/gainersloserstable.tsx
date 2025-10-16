"use client";

import { useCallback, useEffect, useState } from "react";
import { 
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
 } from '@/components/ui/table';
import { currencyFormat } from "@/lib/utils";

type GainerLoserProps = {
  vs_currency?: string;
  duration?: string;
};

type GainerLoserData = {
  id: string,
  name: string,
  symbol: string,
  price: number,
  image: string,
  market_cap_rank: number,
  change: number,
};

export default function GainersLosers({
  vs_currency = "usd",
  duration = "24h"
}: GainerLoserProps) {
  const [gainersData, setGainersData] = useState<GainerLoserData[]>([]);
  const [losersData, setLosersData] = useState<GainerLoserData[]>([]);

  const fetchData = useCallback(async () => {
      const res = await fetch(`/api/market/movers?vs_currency=${vs_currency}&duration=${duration}`);
      const json = await res.json();
      setGainersData(json.gainers);
      setLosersData(json.losers);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
    <Table>
        <TableCaption>Top Gainers</TableCaption>
        <TableHeader>
        <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Market Cap Ranking</TableHead>
            <TableHead>24hr</TableHead>
        </TableRow>
        </TableHeader>

        <TableBody>
            {gainersData.map((coin, i)=> (
                <TableRow key={coin.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium flex items-center gap-2"><img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full"></img> {coin.name} <span className="font-normal font-mono">{coin.symbol.toUpperCase()}</span></TableCell>
                    <TableCell>{currencyFormat(vs_currency, coin.price)}</TableCell>
                    <TableCell>{currencyFormat(vs_currency, coin.market_cap_rank)}</TableCell>
                    <TableCell className={coin.change == 0 ? "text-black" : coin.change > 0 ? "text-green-600" : "text-red-600"}>{currencyFormat(vs_currency, coin.change)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    <Table>
        <TableCaption>Top Losers</TableCaption>
        <TableHeader>
        <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Market Cap Ranking</TableHead>
            <TableHead>24hr</TableHead>
        </TableRow>
        </TableHeader>

        <TableBody>
            {losersData.map((coin, i)=> (
                <TableRow key={coin.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium flex items-center gap-2"><img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full"></img> {coin.name} <span className="font-normal font-mono">{coin.symbol.toUpperCase()}</span></TableCell>
                    <TableCell>{currencyFormat(vs_currency, coin.price)}</TableCell>
                    <TableCell>{currencyFormat(vs_currency, coin.market_cap_rank)}</TableCell>
                    <TableCell className={coin.change == 0 ? "text-black" : coin.change > 0 ? "text-green-600" : "text-red-600"}>{currencyFormat(vs_currency, coin.change)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </div>
  );
}

export { GainersLosers };