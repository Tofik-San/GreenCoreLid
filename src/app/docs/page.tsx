"use client";

import { useEffect, useState } from "react";
import EmailModal from "../../components/EmailModal";

export default function DocsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://web-production-310c7c.up.railway.app";

  // ────────────────────────────────
  // 📦 Загрузка тарифов
  // ────────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/plans`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.plans && Array.isArray(data.plans)) {
          setPlans(data.plans);
        } else {
          setPlans([]);
        }
      })
      .catch(() => setPlans([]));
  }, []);

  // ────────────────────────────────
  // 🌿 Иконки планов
  // ────────────────────────────────
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
    <>
      <main className="min-h-screen px-10 py-20 text-center text-green-100">
        <h1 className="text-5xl mb-16 text-green-400">
          Документация API
        </h1>

        <section className="max-w-[1600px] mx-auto px-8">
          <h2 className="text-3xl mb-14 text-green-400">Планы</h2>

          {plans.length === 0 ? (
            <p className="text-green-300">Нет данных о планах.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-32 relative">
              {plans.map((plan: any) => (
                <div key={plan.id} className="flex flex-col items-center">
                  <div className="bg-black/40 rounded-3xl p-16 w-[420px] min-h-[450px] flex flex-col items-center justify-between">
                    <div className="flex flex-col items-center mb-8">
                      <span className="text-7xl mb-5">
                        {getPlanIcon(plan.name)}
                      </span>
                      <h3 className="text-3xl text-green-300 uppercase">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="text-green-200 mb-10 text-lg text-center">
                      {plan.name.toLowerCase() === "free" && (
                        <>
                          <p>Базовый доступ для тестирования.</p>
                          <p><strong>5 запросов</strong></p>
                        </>
                      )}
                      {plan.name.toLowerCase() === "premium" && (
                        <>
                          <p>Для дизайнеров и студий.</p>
                          <p><strong>20 запросов</strong></p>
                        </>
                      )}
                      {plan.name.toLowerCase() === "supreme" && (
                        <>
                          <p>Полный доступ.</p>
                          <p><strong>100 запросов</strong></p>
                        </>
                      )}
                    </div>

                    <button
                      className="px-12 py-4 rounded-2xl bg-green-700/40 hover:bg-green-600/60"
                      onClick={() => {
                        setSelectedPlan(plan.name);
                        setShowEmailModal(true);
                      }}
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

      {showEmailModal && (
        <EmailModal
          plan={selectedPlan}
          onClose={() => {
            setShowEmailModal(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </>
  );
}
