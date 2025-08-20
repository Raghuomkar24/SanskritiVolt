// lib/actions/talk.ts

"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function sendMessage(message: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);

    return result.response.text();
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return "Sorry, something went wrong with the AI.";
  }
}
