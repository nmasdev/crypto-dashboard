"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Button } from "./ui/button";
import { currencyFormat } from "@/lib/utils";
import { useCurrency } from "app/context/CurrencyContext";

type PriceChartProps = {
  coin: string;
  days?: number;
};

type CoinInfo = {
  id: string;
  name: string;
  symbol: string;
  market_data: {current_price: any};
  description: {en: string};
};

const RANGE_OPTIONS = [
  { label: "1d", value: 1 },
  { label: "1w", value: 7 },
  { label: "1m", value: 30 },
  { label: "6m", value: 180 },
  { label: "1y", value: 365 },
];

export default function PriceChart({
  coin
}: PriceChartProps) {
  const [error, setError] = useState<boolean>(false);
  const [info, setInfo] = useState<CoinInfo>({id: "-", name: "-", symbol: "-", market_data: {current_price: {usd: 0}}, description: {en:""}});
  const [data, setData] = useState<{ time: number; price: number }[]>([]);
  const [days, setDays] = useState<number>(7);
  const { currency } = useCurrency();

  const fetchInfo = useCallback(async () => {
      const res = await fetch(`/api/coins/${coin}/info`);
      if (res.ok) {
        const json = await res.json();
        setInfo(json);
      } else {
        setError(true);
      }
  }, [coin]);

  const fetchData = useCallback(async () => {
      const res = await fetch(`/api/coins/${coin}?days=${days}&vs_currency=${currency}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError(true);
      }
  }, [coin, currency, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  if (error) {
    return (
      <div className="w-full h-100 p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex items-center justify-center text-red-500">
        Failed to load chart data.
      </div>
    );
  }

  return (
    <div className="w-full md:h-[64rem] h-[32rem] p-4 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h1 className="font-bold text-2xl">{info.name} <span className="font-normal font-mono">{info.symbol.toUpperCase()}</span></h1>
      <p>{info.market_data ? currencyFormat(currency, info.market_data.current_price[currency]) : ""}</p>
        <div className="flex justify-between items-center mb-2">
        <h2 hidden={info.id === "NULL"}
          className="text-lg font-semibold text-gray-800 dark:text-gray-100"
        >
          Price data (Last {days} Day{days > 1 ? "s" : ""})
        </h2>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map(({ label, value }) => (
            <Button
              key={value}
              variant={value === days ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" 
            interval="preserveStartEnd"
            tickFormatter={(tick) => {
              const d = new Date(tick);
              return days <= 1
                ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                : d.toLocaleDateString([], { month: "short", day: "numeric" });
            }}
            minTickGap={40}
          />
          <YAxis
            width={80}
            domain={["auto", "auto"]} 
            tickFormatter={(val) => currencyFormat(currency, val)}
          />
          <Tooltip
              labelFormatter={(value) => {
                const d = new Date(value);
                return days <= 1
                  ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
                  : d.toLocaleDateString([], { month: "short", day: "numeric" });
              }} 
              formatter={(value: number) => [currencyFormat(currency, value), "Price"]}
              isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <h3 className="font-medium text-2x3 mt-10 mb-6" hidden={info.description.en == ""}>Description</h3>
      <p className="pb-10" hidden={info.description.en == ""}>{info.description.en}</p>
    </div>
  );
}

export { PriceChart };