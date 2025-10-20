"use client";
import { useEffect, useState } from "react";

export default function DocsPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://web-production-310c7c.up.railway.app";

    fetch(`${API_URL}/plans`)
      .then((res) => res.json())
      .then((data) => {
        // Гарантируем, что всегда массив
        if (Array.isArray(data)) setPlans(data);
        else if (data && typeof data === "object") setPlans(Object.values(data));
        else setPlans([]);
      })
      .catch(() => setPlans([]));
  }, []);

  return (
    <main className="min-h-screen p-10 text-center text-green-100">
      <h1 className="text-4xl mb-8 text-green-400">Документация API</h1>
      <h2 className="text-2xl mb-4">Эндпоинты</h2>
      <ul className="mb-8 space-y-2">
        <li>GET /plants — список растений</li>
        <li>POST /generate_key — сгенерировать API-ключ</li>
        <li>GET /health — проверка статуса</li>
      </ul>

      <h2 className="text-2xl mt-12 mb-4">Планы</h2>
      {plans.length === 0 ? (
        <p>Нет данных о планах.</p>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {(Array.isArray(plans) ? plans : []).map((plan: any, index: number) => (
            <div
              key={index}
              className="border border-green-500 p-4 rounded-lg max-w-md w-full"
            >
              <h3 className="text-green-300 text-xl">{plan.name}</h3>
              <p>{plan.description}</p>
              <p className="text-green-400">
                {plan.requests_per_day} запросов/день
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
