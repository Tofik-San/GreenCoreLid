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
    <main className="min-h-screen flex flex-col items-center justify-center text-green-400 text-center bg-black">
      <h1 className="text-5xl font-bold mb-8 drop-shadow-[0_0_12px_rgba(83,255,148,0.7)]">
        Оплата прошла успешно
      </h1>

      {loading && <p className="text-green-300">Обработка платежа...</p>}

      {!loading && key && (
        <>
          <p className="text-lg text-green-200 mb-4">Ваш API-ключ:</p>
          <div className="w-full max-w-[600px] px-6">
            <CopyBlock code={key} />
          </div>
        </>
      )}

      {!loading && !key && (
        <p className="text-green-300">
          Ключ пока не найден. Обновите страницу через несколько секунд.
        </p>
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
