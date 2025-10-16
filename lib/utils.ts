import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function currencyFormat(currency: string, val: number) {
  return Intl.NumberFormat('en', {currency: currency, style: 'currency'}).format(val);
}

export function shortCurrencyFormat(currency: string, val: number) {
  return Intl.NumberFormat("en-US", { 
    style: "currency",
    currency: "USD",
    notation: "compact", 
    compactDisplay: "short" 
  }).format(val);
}

export function percentFormat(val: number) {
  return Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val/100);
}

 export const SAVED_COIN_KEY = "savedCoins";

