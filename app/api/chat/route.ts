import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const { messages, coin, currency, context } = await req.json();

    const systemPrompt = `
  You are a helpful crypto assistant. You have access to the following market data for the ${coin} coin in ${currency} currency:
  ${JSON.stringify(context, null, 2)}
  Use it to answer questions and summarize market information.
  Always cite values directly from the data.
  `;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
        });

        const reply = completion.choices[0].message.content;
        return NextResponse.json({ reply });
    } catch (err: any) {
        console.error("OpenAI API Error:", err);

        if (err.status === 429) {
            return NextResponse.json({
                reply: "⚠️ The AI assistant is currently at capacity (quota exceeded or rate limited). Please try again in a moment.",
            }, { status: 429 });
        }

        return NextResponse.json({
            reply: "❌ Sorry, something went wrong while contacting the AI service. Please try again later.",
            error: err.message || err.toString(),
        }, { status: 500 });
    }
}

