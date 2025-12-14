"use client";

import { useEffect, useState } from "react";

export default function DocsPage() {
  // ========================
  // STATE
  // ========================
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [showFreeModal, setShowFreeModal] = useState(false);
  const [freeEmail, setFreeEmail] = useState("");
  const [freeLoading, setFreeLoading] = useState(false);
  const [freeSuccess, setFreeSuccess] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://web-production-310c7c.up.railway.app";

  // ========================
  // LOAD PLANS
  // ========================
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

  // ========================
  // ACTIVATE PLAN
  // ========================
  const handleActivate = async (planName: string) => {
    try {
      setLoadingPlan(planName);
      setMessage(null);

      if (planName.toLowerCase() === "free") {
        setShowFreeModal(true);
        setLoadingPlan(null);
        return;
      }

      // ПЛАТНЫЕ ТАРИФЫ
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

  // ========================
  // FREE SUBMIT
  // ========================
  const handleFreeSubmit = async () => {
    if (!freeEmail) return;

    try {
      setFreeLoading(true);
      setMessage(null);

      const res = await fetch(`${API_URL}/create_user_key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_email: freeEmail,
          plan: "free",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Ошибка при создании ключа");
      }

      setFreeSuccess(true);
    } catch (err: any) {
      setMessage(err.message || "Ошибка");
      setTimeout(() => setMessage(null), 8000);
    } finally {
      setFreeLoading(false);
    }
  };

  // ========================
  // RENDER
  // ========================
  return (
    <main className="min-h-screen bg-black text-green-100 px-6 py-12">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-4xl text-green-300 text-center mb-12">
          Документация API
        </h1>

        {message && (
          <div className="mb-6 text-center text-red-400">{message}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="border border-green-500/40 rounded-2xl p-8 bg-black relative"
            >
              <h3 className="text-2xl text-green-300 mb-4">
                {plan.name.toUpperCase()}
              </h3>

              <p className="mb-6 text-green-200">{plan.description}</p>

              <p className="mb-6 text-green-400">
                {plan.price_rub ? `${plan.price_rub} ₽` : "Бесплатно"}
              </p>

              <button
                onClick={() => handleActivate(plan.name)}
                disabled={loadingPlan === plan.name}
                className="w-full py-3 bg-green-700 rounded text-white hover:bg-green-600 transition"
              >
                {loadingPlan === plan.name ? "Создание..." : "Активировать"}
              </button>

              {index < plans.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-[-60px] w-px h-[280px] bg-gradient-to-b from-green-500/0 via-green-500/50 to-green-500/0" />
              )}
            </div>
          ))}
        </div>

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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-green-400 rounded-2xl p-8 w-[420px]">
            <h3 className="text-2xl text-green-300 mb-4">
              Бесплатный доступ
            </h3>

            {!freeSuccess ? (
              <>
                <input
                  type="email"
                  placeholder="Введите email"
                  value={freeEmail}
                  onChange={(e) => setFreeEmail(e.target.value)}
                  className="w-full mb-4 p-3 rounded bg-black border border-green-400 text-green-100"
                />

                <button
                  disabled={freeLoading}
                  onClick={handleFreeSubmit}
                  className="w-full py-3 bg-green-700 rounded text-white"
                >
                  {freeLoading ? "Отправка..." : "Получить ключ"}
                </button>
              </>
            ) : (
              <p className="text-green-300">
                Ключ отправлен на почту
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
