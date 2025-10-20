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
        if (data?.plans && Array.isArray(data.plans)) setPlans(data.plans);
        else setPlans([]);
      })
      .catch(() => setPlans([]));
  }, []);

  const getPlanIcon = (name: string) => {
    switch (name?.toLowerCase()) {
      case "free":
        return "🌱";
      case "premium":
        return "🌿";
      case "supreme":
        return "🌳";
      default:
        return "🌾";
    }
  };

  return (
    <main className="min-h-screen px-10 py-16 text-center text-green-100">
      <h1 className="text-5xl mb-12 text-green-400 drop-shadow-[0_0_10px_rgba(163,255,163,0.7)]">
        Документация API
      </h1>

      {/* Раздел эндпоинтов */}
      <section>
        <h2 className="text-2xl mb-4 text-green-300">Эндпоинты</h2>
        <ul className="mb-16 space-y-2 text-green-200">
          <li>GET /plants — список растений</li>
          <li>POST /generate_key — сгенерировать API-ключ</li>
          <li>GET /health — проверка статуса</li>
        </ul>
      </section>

      {/* Раздел тарифов */}
      <section className="max-w-[1400px] mx-auto">
        <h2 className="text-3xl mb-10 text-green-400">Планы</h2>
        {plans.length === 0 ? (
          <p className="text-green-300">Нет данных о планах.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center">
            {plans.map((plan: any) => (
              <div
                key={plan.id}
                className="bg-black/40 border-[2px] border-green-500/70 hover:border-green-400 transition-all duration-300 rounded-2xl shadow-[0_0_40px_rgba(83,255,148,0.2)] p-12 w-[360px] flex flex-col justify-between hover:shadow-[0_0_45px_rgba(83,255,148,0.4)]"
              >
                {/* Иконка и название */}
                <div className="flex flex-col items-center mb-6">
                  <span className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(83,255,148,0.6)]">
                    {getPlanIcon(plan.name)}
                  </span>
                  <h3 className="text-3xl text-green-300 font-semibold drop-shadow-[0_0_6px_rgba(83,255,148,0.6)] uppercase">
                    {plan.name}
                  </h3>
                </div>

                {/* Информация по тарифу */}
                <div className="text-green-200 mb-10 text-base leading-relaxed space-y-4 text-left">
                  <p>
                    Общее ограничение:{" "}
                    <span className="text-green-400 font-medium">
                      {plan.limit_total}
                    </span>
                  </p>
                  <p>
                    Макс. страница:{" "}
                    <span className="text-green-400 font-medium">
                      {plan.max_page}
                    </span>
                  </p>
                </div>

                {/* Цена и кнопка */}
                <div className="flex flex-col items-center mt-auto">
                  <p className="text-green-400 font-semibold text-xl mb-4">
                    {plan.price === 0 ? "БЕСПЛАТНО" : `${plan.price} ₽ / мес`}
                  </p>
                  <button
                    className="px-10 py-3 rounded-xl bg-green-700/40 hover:bg-green-600/60 text-green-100 font-medium shadow-[0_0_20px_rgba(83,255,148,0.5)] transition"
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
