"use client";
import { useState } from "react";

export default function KeysPage() {
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://web-production-310c7cup.railway.app";

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate_key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setKey(data.api_key || "Ошибка генерации");
    } catch {
      setKey("Ошибка подключения к серверу");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center py-16">
      <h1 className="text-5xl font-bold mb-6 text-green-300">🔑 Генерация API-ключа</h1>
      <p className="text-gray-400 mb-8">Введите email, чтобы получить бесплатный ключ:</p>
      <div className="flex space-x-2">
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-lg border border-green-600 bg-neutral-900 text-green-400 focus:outline-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-2 bg-green-400 text-black font-bold rounded-lg hover:bg-green-500 transition"
        >
          {loading ? "Генерация..." : "Получить ключ"}
        </button>
      </div>
      {key && (
        <p className="mt-6 text-green-300 text-xl">
          {key === "Ошибка генерации" ? "⚠️ Ошибка" : `Ваш ключ: ${key}`}
        </p>
      )}
    </div>
  );
}
