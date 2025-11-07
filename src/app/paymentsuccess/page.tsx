"use client";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    // Получаем последний выданный ключ пользователя (по email test@example.com)
    fetch("https://web-production-310c7c.up.railway.app/api/payments/latest?email=test@example.com")
      .then(res => res.json())
      .then(data => setKey(data?.api_key || null))
      .catch(() => setKey(null));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-green-400 text-center">
      <h1 className="text-5xl font-bold mb-8">Оплата прошла успешно</h1>
      {key ? (
        <>
          <p className="text-lg text-green-200 mb-8">Ваш API-ключ:</p>
          <div className="bg-black/50 border border-green-400/50 rounded-xl px-6 py-3 font-mono text-green-300 shadow-[0_0_20px_rgba(83,255,148,0.4)]">
            {key}
          </div>
        </>
      ) : (
        <p className="text-green-300">Ключ обрабатывается… обновите страницу через несколько секунд.</p>
      )}
      <a
        href="/docs"
        className="mt-10 px-8 py-4 bg-green-700/40 rounded-2xl hover:bg-green-600/60 transition"
      >
        Вернуться в документацию API
      </a>
    </main>
  );
}
