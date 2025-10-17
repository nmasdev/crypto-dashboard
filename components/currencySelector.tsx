"use client";

import { useCurrency } from "app/context/CurrencyContext";

const currencies = [
  "aed", "ars", "aud", "bch", "bdt", "bhd", "bmd", "bnb", "brl", "btc", "cad", "chf", "clp", "cny", "czk",
  "dkk", "dot", "eos", "eth", "eur", "gbp", "gel", "hkd", "huf", "idr", "ils", "inr", "jpy", "krw", "kwd",
  "lkr", "ltc", "mmk", "mxn", "myr", "ngn", "nok", "nzd", "php", "pkr", "pln", "rub", "sar", "sek", "sgd",
  "sol", "thb", "try", "twd", "uah", "usd", "vef", "vnd", "xag", "xau", "xdr", "xlm", "xrp", "yfi", "zar",
  "bits", "link", "sats",
];

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="currency" className="text-sm text-muted-foreground">
        Currency:
      </label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {currencies.map((code) => (
          <option key={code} value={code}>
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
