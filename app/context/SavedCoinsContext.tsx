"use client";

import { createContext, useContext } from "react";
import { useSavedCoins } from "app/hooks/useSavedCoins";

type SavedCoinsContextType = ReturnType<typeof useSavedCoins>;

const SavedCoinsContext = createContext<SavedCoinsContextType | null>(null);

export function SavedCoinsProvider({ children }: { children: React.ReactNode }) {
  const savedCoins = useSavedCoins();
  return (
    <SavedCoinsContext.Provider value={savedCoins}>
      {children}
    </SavedCoinsContext.Provider>
  );
}

export function useSavedCoinsContext() {
  const ctx = useContext(SavedCoinsContext);
  if (!ctx) throw new Error("useSavedCoinsContext must be used within a SavedCoinsProvider");
  return ctx;
}