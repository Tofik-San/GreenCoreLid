"use client";

import { useEffect, useState } from "react";

type Plan = {
  name: string;
  title: string;
  description: string;
  price_rub: number;
};

export default function DocsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // FREE modal state
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [freeEmail, setFreeEmail] = useState("");
  const [freeLoading, setFreeLoading] = useState(false);
  const [freeSuccess, setFreeSuccess] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://greencore-api.ru";

  // load plans
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
  }, [API_URL]);

  // activate handler
  const handleActivate = async (planName: string) => {
    try {
      setLoadingPlan(planName);
      setMessage(null);

      // FREE → only modal
      if (planName.toLowerCase() === "free") {
        setShowFreeModal(true);
        setLoadingPlan(null);
        return;
      }

      // PAID plans → YooKassa
      const email = "test@example.com"; // временно
      const res = await fetch(
        `${API_URL}/api/payment/session?plan=${planName}&email=${email}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (res.ok && data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error(data?.detail || "Ошибка при создании платежа");
      }
    } catch (err: any) {
      setMessage(err.message || "Ошибка");
      setTimeout(() => setMessage(null), 8000);
    } finally {
      setLoadingPlan(null);
    }
  };

  // free submit
  const handleFreeSubmit = async () => {
    if (!freeEmail) return;

    try {
      setFreeLoading(true);

      const res = await fetch(
        `${API_URL}/create_user_key?plan=free&email=${encodeURIComponent(
          freeEmail
        )}`,
        { method: "POST" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Ошибка");

      setFreeSuccess(true);
    } catch {
      alert("Ошибка отправки ключа");
    } finally {
      setFreeLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-100">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl text-center text-green-300 mb-12">
          Документация API
        </h1>

        <div className="grid md:grid-cols-3 gap-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative border border-green-500/40 rounded-2xl p-8 bg-black/60"
            >
              <h2 className="text-2xl text-green-300 mb-4 uppercase">
                {plan.title || plan.name}
              </h2>

              <p className="text-green-200 mb-6">
                {plan.description}
              </p>

              <div className="text-xl mb-6">
                {plan.price_rub > 0 ? (
                  <>
                    {plan.price_rub} ₽
                  </>
                ) : (
                  <>Бесплатно</>
                )}
              </div>

              <button
                onClick={() => handleActivate(plan.name)}
                disabled={loadingPlan === plan.name}
                className="w-full py-3 bg-white text-black rounded font-semibold"
              >
                {loadingPlan === plan.name
                  ? "Создание..."
                  : "Активировать"}
              </button>
            </div>
          ))}
        </div>

        {message && (
          <p className="text-center text-red-400 mt-8">{message}</p>
        )}

        <div className="flex justify-center mt-20">
          <a
            href="/search"
            className="gc-btn"
            style={{
              fontSize: "16px",
              padding: "0.9rem 1.8rem",
              borderRadius: "1rem",
              boxShadow:
                "0 0 14px rgba(173,255,83,0.4), inset 0 -3px 8px rgba(0,0,0,0.25)",
              letterSpacing: "0.5px",
              filter: "brightness(1.2)",
            }}
          >
            Перейти к поиску растений
          </a>
        </div>
      </section>

      {/* FREE MODAL */}
      {showFreeModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-black border border-green-400 rounded-2xl p-8 w-[420px] text-center">
            <h3 className="text-2xl text-green-300 mb-4">
              Бесплатный доступ
            </h3>

            {!freeSuccess ? (
              <>
                <input
                  type="email"
                  value={freeEmail}
                  onChange={(e) => setFreeEmail(e.target.value)}
                  placeholder="Введите email"
                  className="w-full mb-4 p-3 rounded bg-black border border-green-400 text-green-100"
                />

                <button
                  onClick={handleFreeSubmit}
                  disabled={freeLoading}
                  className="w-full py-3 bg-green-600 rounded text-black font-semibold"
                >
                  {freeLoading ? "Отправка..." : "Получить ключ"}
                </button>
              </>
            ) : (
              <p className="text-green-300">
                Ключ отправлен на почту
              </p>
            )}

            <button
              className="mt-6 text-green-400 underline"
              onClick={() => {
                setShowFreeModal(false);
                setFreeSuccess(false);
                setFreeEmail("");
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
