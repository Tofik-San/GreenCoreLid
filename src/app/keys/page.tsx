"use client";
import { useState } from "react";

export default function KeysPage() {
  const [plan, setPlan] = useState("free");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://web-production-310c7c.up.railway.app"; // ✅ исправлен адрес

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/create_user_key?plan=${plan}`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.api_key) {
        setKey(data.api_key);
        localStorage.setItem("api_key", data.api_key);
      } else {
        setKey("Ошибка генерации");
      }
    } catch {
      setKey("Ошибка подключения к серверу");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center py-16">
      <h1 className="text-5xl font-bold mb-6 text-green-300">
        🔑 Получить API-ключ
      </h1>

      <p className="text-gray-400 mb-8">
        Выберите тариф и получите ключ доступа:
      </p>

      <div className="flex space-x-3 mb-8">
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="px-4 py-2 rounded-lg border border-green-600 bg-neutral-900 text-green-400 focus:outline-none"
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
          <option value="supreme">Supreme</option>
        </select>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-2 bg-green-400 text-black font-bold rounded-lg hover:bg-green-500 transition"
        >
          {loading ? "Создание..." : "Активировать"}
        </button>
      </div>

      {key && (
        <p className="mt-6 text-green-300 text-xl break-all">
          {key === "Ошибка генерации"
            ? "⚠️ Ошибка"
            : `Ваш ключ: ${key}`}
        </p>
      )}
    </div>
  );
}
