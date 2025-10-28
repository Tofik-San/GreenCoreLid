"use client";
import { useEffect, useState } from "react";

export default function DocsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://web-production-310c7c.up.railway.app";

  useEffect(() => {
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

  const handleActivate = async (planName: string) => {
    try {
      setLoadingPlan(planName);
      setMessage(null);

      const res = await fetch(`${API_URL}/create_user_key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName }),
      });

      const data = await res.json();

      if (res.ok && data?.api_key) {
        setMessage(`🔑 Ключ успешно создан: ${data.api_key}`);
      } else {
        setMessage(
          `Ошибка: ${data?.detail || data?.error || "Не удалось создать ключ."}`
        );
      }
    } catch {
      setMessage("Ошибка соединения с сервером.");
    } finally {
      setLoadingPlan(null);
      setTimeout(() => setMessage(null), 8000);
    }
  };

  return (
    <main className="min-h-screen px-10 py-20 text-center text-green-100">
      <h1 className="text-5xl mb-16 text-green-400 drop-shadow-[0_0_10px_rgba(163,255,163,0.7)]">
        Документация API
      </h1>

      {/* Раздел тарифов */}
      <section className="max-w-[1600px] mx-auto px-8">
        <h2 className="text-3xl mb-14 text-green-400">Планы</h2>

        {message && (
          <div className="mb-12 text-green-300 bg-black/50 border border-green-400/50 px-8 py-5 rounded-2xl shadow-[0_0_25px_rgba(83,255,148,0.3)] inline-block">
            {message}
          </div>
        )}

        {plans.length === 0 ? (
          <p className="text-green-300">Нет данных о планах.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-24 relative">
            {plans.map((plan: any, index: number) => (
              <div key={plan.id} className="relative flex flex-col items-center">
                 <div className="bg-black/40 border-2 border-green-500/70 hover:border-green-400 transition-all duration-300 rounded-3xl shadow-[0_0_50px_rgba(83,255,148,0.25)] p-16 w-[420px] min-h-[600px] flex flex-col justify-between hover:shadow-[0_0_70px_rgba(83,255,148,0.45)]">
                  <div className="flex flex-col items-center mb-8">
                    <span className="text-7xl mb-5 drop-shadow-[0_0_20px_rgba(83,255,148,0.6)]">
                      {getPlanIcon(plan.name)}
                    </span>
                    <h3 className="text-3xl text-green-300 font-semibold drop-shadow-[0_0_6px_rgba(83,255,148,0.6)] uppercase tracking-wide">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="text-green-200 mb-12 text-lg leading-relaxed space-y-5 text-left">
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

                  <div className="flex flex-col items-center mt-auto">
                    <p className="text-green-400 font-semibold text-2xl mb-5">
                      {plan.price === 0
                        ? "БЕСПЛАТНО"
                        : `${plan.price} ₽ / мес`}
                    </p>
                    <button
                      disabled={loadingPlan === plan.name}
                      className={`px-12 py-4 rounded-2xl ${
                        loadingPlan === plan.name
                          ? "bg-green-800/30 cursor-wait"
                          : "bg-green-700/40 hover:bg-green-600/60"
                      } text-green-100 font-medium text-lg shadow-[0_0_25px_rgba(83,255,148,0.5)] transition`}
                      onClick={() => handleActivate(plan.name)}
                    >
                      {loadingPlan === plan.name
                        ? "Создание..."
                        : "Активировать"}
                    </button>
                  </div>
                </div>

                {index < plans.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-[-60px] w-px h-[280px] bg-gradient-to-b from-green-400/70 via-green-300/40 to-transparent blur-[1px] shadow-[0_0_15px_rgba(83,255,148,0.7)]" />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
