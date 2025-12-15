"use client";
import { useEffect, useState } from "react";
import EmailModal from "../../components/EmailModal";

export default function DocsPage() {
 const [showModal, setShowModal] = useState(false);
 const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://web-production-310c7c.up.railway.app";

  // ────────────────────────────────
  // 📦 Загрузка тарифов из API
  // ────────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/plans`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.plans && Array.isArray(data.plans)) setPlans(data.plans);
        else setPlans([]);
      })
      .catch(() => setPlans([]));
  }, []);

  // ────────────────────────────────
  // 💳 Обработчик кнопки "Активировать"
  // ────────────────────────────────
  const handleActivate = async (planName: string) => {
    setSelectedPlan(planName);
    setShowModal(true);
    return;
  };

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
        <h1 className="text-5xl mb-16 text-green-400 drop-shadow-[0_0_10px_rgba(163,255,163,0.7)]">
          Документация API
        </h1>

        <section className="max-w-[1600px] mx-auto px-8">
          <h2 className="text-3xl mb-14 text-green-400">Планы</h2>

          {plans.length === 0 ? (
            <p className="text-green-300">Нет данных о планах.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-32 relative">
              {plans.map((plan: any, index: number) => (
                <div
                  key={plan.id}
                  className="relative flex flex-col items-center mx-4 my-6"
                >
                  <div className="bg-black/40 transition-all duration-300 rounded-3xl shadow-[0_0_50px_rgba(83,255,148,0.25)] p-16 w-[420px] min-h-[450px] flex flex-col items-center justify-between hover:shadow-[0_0_70px_rgba(83,255,148,0.45)]">
                    <div className="flex flex-col items-center mb-8">
                      <span className="text-7xl mb-5 drop-shadow-[0_0_20px_rgba(83,255,148,0.6)]">
                        {getPlanIcon(plan.name)}
                      </span>
                      <h3 className="text-3xl text-green-300 font-semibold uppercase tracking-wide">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="text-green-200 mb-10 text-lg leading-relaxed space-y-5 text-center max-w-[340px]">
                      {plan.name.toLowerCase() === "free" && (
                        <>
                          <p>Базовый доступ для тестирования.</p>
                          <p>
                            <strong>5 запросов</strong> • до{" "}
                            <strong>5 карточек</strong>
                          </p>
                        </>
                      )}
                      {plan.name.toLowerCase() === "premium" && (
                        <>
                          <p>Для дизайнеров и студий.</p>
                          <p>
                            <strong>20 запросов</strong> • до{" "}
                            <strong>5 карточек</strong>
                          </p>
                        </>
                      )}
                      {plan.name.toLowerCase() === "supreme" && (
                        <>
                          <p>Полный доступ.</p>
                          <p>
                            <strong>100 запросов</strong> • до{" "}
                            <strong>20 карточек</strong>
                          </p>
                        </>
                      )}
                    </div>

                    <button
                      className="px-12 py-4 rounded-2xl bg-green-700/40 hover:bg-green-600/60 text-green-100 font-medium text-lg shadow-[0_0_25px_rgba(83,255,148,0.5)] transition"
                      onClick={() => handleActivate(plan.name)}
                    >
                      Активировать
                    </button>
                  </div>

                  {index < plans.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-[-60px] w-px h-[280px] bg-gradient-to-b from-green-400/70 via-green-300/40 to-transparent blur-[1px]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

     {showModal && (
       <EmailModal
         plan={selectedPlan}
         onClose={() => {
           setShowModal(false);
           setSelectedPlan(null);
     }}
   />
 )}
 