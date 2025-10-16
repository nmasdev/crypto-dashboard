import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { CurrencyProvider } from './context/CurrencyContext';
import { Metadata } from 'next';
import { SavedCoinsProvider } from './context/SavedCoinsContext';

export const metadata: Metadata = {
  title: 'CoinPulse',
  description:
    'A cryptocurrency dashboard that provides the latest prices and AI-powered insights into the crypto world.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        <CurrencyProvider>
          <SavedCoinsProvider>
            {children}
          </SavedCoinsProvider>
        </CurrencyProvider>
      </body>
      <Analytics />
    </html>
  );
}
