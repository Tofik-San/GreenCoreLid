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
        if (Array.isArray(data)) setPlans(data);
        else if (data && typeof data === "object") setPlans(Object.values(data));
        else setPlans([]);
      })
      .catch(() => setPlans([]));
  }, []);

  return (
    <main className="min-h-screen p-10 text-center text-green-100">
      <h1 className="text-5xl mb-12 text-green-400 drop-shadow-[0_0_10px_rgba(163,255,163,0.7)]">
        Документация API
      </h1>

      <section>
        <h2 className="text-2xl mb-4 text-green-300">Эндпоинты</h2>
        <ul className="mb-16 space-y-2 text-green-200">
          <li>GET /plants — список растений</li>
          <li>POST /generate_key — сгенерировать API-ключ</li>
          <li>GET /health — проверка статуса</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl mb-10 text-green-400">Планы</h2>
        {plans.length === 0 ? (
          <p className="text-green-300">Нет данных о планах.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-10">
            {plans.map((plan: any, index: number) => (
              <div
                key={index}
                className="bg-black/40 border border-green-500/70 hover:border-green-400 transition rounded-2xl shadow-[0_0_25px_rgba(83,255,148,0.15)] p-8 w-[300px] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl text-green-300 mb-3 font-semibold drop-shadow-[0_0_6px_rgba(83,255,148,0.6)]">
                    {plan.name?.toUpperCase() || "UNTITLED"}
                  </h3>
                  <p className="text-green-200 text-sm mb-6 leading-relaxed">
                    {plan.description || "Описание недоступно."}
                  </p>
                </div>

                <div className="flex flex-col items-center mt-auto">
                  <p className="text-green-400 font-semibold text-lg mb-4">
                    {plan.requests_per_day
                      ? `${plan.requests_per_day} запросов/день`
                      : "Не указано"}
                  </p>

                  <button
                    className="px-6 py-2 rounded-xl bg-green-700/40 hover:bg-green-600/60 text-green-100 font-medium shadow-[0_0_10px_rgba(83,255,148,0.4)] transition"
                    onClick={() => alert(`Выбран план: ${plan.name}`)}
                  >
                    Активировать
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
