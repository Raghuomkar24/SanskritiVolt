"use client";
import React, { useEffect, useState, useRef } from "react";
import { sendMessage } from "@/lib/actions/talk";

export default function ChatbotUI() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to end when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    const reply = await sendMessage(input);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md max-w-[75%] ${
              msg.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex mt-2">
        <input
          className="flex-1 p-2 border rounded-l-md focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
