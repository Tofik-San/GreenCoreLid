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
    <main className="min-h-screen flex flex-col items-center justify-start text-center bg-black relative overflow-hidden px-6 pt-[12vh] pb-[8vh]">
      {/* фон свечения */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(83,255,148,0.06),transparent_80%)] pointer-events-none" />

      {/* заголовок */}
      <h1 className="text-5xl font-bold mb-10 text-green-300 drop-shadow-[0_0_20px_rgba(83,255,148,0.6)] animate-pulse">
        Оплата прошла успешно
      </h1>

      {/* блок ключа */}
      {loading && <p className="text-green-300 mt-6">Обработка платежа...</p>}

      {!loading && key && (
        <>
          <p className="text-green-200 mb-4 text-lg">Ваш API-ключ:</p>
          <div className="relative w-full max-w-[720px] px-8 py-4 bg-[rgba(12,20,14,0.8)] border border-green-400/30 rounded-xl shadow-[0_0_16px_rgba(83,255,148,0.15)] backdrop-blur-sm mb-12">
            <CopyBlock code={key} />
          </div>
        </>
      )}

      {!loading && !key && (
        <p className="text-green-300 mt-4">
          Ключ пока не найден. Обновите страницу через несколько секунд.
        </p>
      )}

      {/* кнопка */}
      <a
        href="/search"
        className="inline-block px-50 py-3 rounded-full bg-[linear-gradient(90deg,#3fd67c,#53ff94)] text-[#04140a] font-semibold hover:brightness-110 transition duration-200 shadow-[0_0_14px_rgba(83,255,148,0.4)] no-underline"
        style={{
          textDecoration: "none",
          marginTop: "80px", // жёсткий отступ, чтобы не слипалось
        }}
      >
        Перейти к поиску растений
      </a>
    </main>
  );
}
