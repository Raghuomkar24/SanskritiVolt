import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, state } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing" },
        { status: 400 }
      );
    }

    const prompt = `Give a 2-sentence cultural/historical description of "${name}" in ${state || "India"}. Avoid fluff and dates unless important.`;

    // Using fetch to Generative Language API (no extra library needed)
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No additional info available.";

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to generate description" },
      { status: 500 }
    );
  }
}
