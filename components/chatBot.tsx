"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ChatBot({ coin, currency, contextData }: { coin: string, currency: string, contextData: any }) {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: newMessages,
                coin: coin,
                context: contextData,
            }),
        });

        const data = await res.json();
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        setLoading(false);
    };

    return (
        <div className="fixed right-0 bottom-0 m-10 border rounded-xl bg-background/50 backdrop-blur p-4 w-full max-w-md">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-lg ${msg.role === "user" ? "bg-gray-600 text-white self-end" : "bg-gray-200 text-black"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {loading && <div className="text-sm text-gray-400">Thinking...</div>}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
                className="flex gap-2"
            >
                <Input
                    className="flex-1 border rounded-lg px-3 py-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Get AI insights"
                />
                <Button
                    disabled={loading}
                >
                    Send
                </Button>
            </form>
        </div>
    );
}
