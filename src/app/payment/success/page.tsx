"use client";
import { useEffect, useState } from "react";
import CopyBlock from "@/components/CopyBlock";

export default function PaymentSuccess() {
  const [key, setKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKey() {
      try {
        const res = await fetch(
          "https://web-production-310c7c.up.railway.app/api/payments/latest?email=test@example.com"
        );
        const data = await res.json();
        if (data?.api_key) setKey(data.api_key);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchKey();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-black relative overflow-hidden">
      {/* мягкий радиальный фон */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(83,255,148,0.05),transparent_70%)] pointer-events-none" />

      <h1 className="text-5xl font-bold mb-8 text-green-300 drop-shadow-[0_0_20px_rgba(83,255,148,0.6)] animate-pulse">
        Оплата прошла успешно
      </h1>

      {loading && <p className="text-green-300">Обработка платежа...</p>}

      {!loading && key && (
        <>
          <p className="text-green-200 mb-3 text-lg">Ваш API-ключ:</p>
          <div className="relative w-full max-w-[640px] px-6 py-3 bg-[rgba(12,20,14,0.8)] border border-green-400/30 rounded-xl shadow-[0_0_16px_rgba(83,255,148,0.15)] backdrop-blur-sm">
            <CopyBlock code={key} />
          </div>
        </>
      )}

      {!loading && !key && (
        <p className="text-green-300 mt-4">
          Ключ пока не найден. Обновите страницу через несколько секунд.
        </p>
      )}

      <a
        href="/search"
        className="mt-12 px-8 py-3 rounded-xl bg-[linear-gradient(90deg,#3fd67c,#53ff94)] text-[#04140a] font-semibold hover:brightness-110 transition duration-200 shadow-[0_0_14px_rgba(83,255,148,0.4)]"
      >
        Перейти к поиску растений
      </a>
    </main>
  );
}
