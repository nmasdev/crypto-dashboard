"use client";

import { SAVED_COIN_KEY } from "@/lib/utils";
import { useState, useEffect } from "react";

export function useSavedCoins() {
    const [savedCoins, setSavedCoins] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(SAVED_COIN_KEY);
        if (stored) {
            try {
                setSavedCoins(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing saved coins:", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(SAVED_COIN_KEY, JSON.stringify(savedCoins));
    }, [savedCoins]);

    const addCoin = (id: string) => {
        setSavedCoins((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const removeCoin = (id: string) => {
        setSavedCoins((prev) => prev.filter((c) => c !== id));
    };

    const toggleCoin = (id: string) => {
        setSavedCoins((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };


    return { savedCoins, addCoin, removeCoin, toggleCoin };
}