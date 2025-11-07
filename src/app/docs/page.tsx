"use client";
import { useState } from "react";

export default function DocsPage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://web-production-310c7c.up.railway.app";

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  // ────────────────────────────────
  // 📬 Обработчик активации плана
  // ────────────────────────────────
  const handleActivate = async (plan: string) => {
    try {
      setLoading(plan);
      setMessage("");

      if (plan === "free") {
        // Создаём бесплатный ключ
        const res = await fetch(`${API_URL}/create_user_key?plan=free`, {
          method: "POST",
        });
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        setMessage(`🔑 Ключ успешно создан: ${data.api_key}`);
        setLoading(null);
        return;
      }

      // Для платных тарифов создаём платёж
      const email = "test@example.com"; // можно позже заменить на email пользователя
      const res = await fetch(
        `${API_URL}/api/payment/session?plan=${plan}&email=${email}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();

      if (data.payment_url) {
        window.location.href = data.payment_url; // переход на YooKassa
      } else {
        throw new Error("Не получен payment_url");
      }
    } catch (err: any) {
      setMessage(`⚠ ${err.message}`);
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 text-center text-green-100 bg-black">
      <h1 className="text-5xl text-green-400 mb-10 drop-shadow-[0_0_12px_rgba(83,255,148,0.6)]">
        Документация API
      </h1>
      {message && (
        <div className="mb-10 text-green-300 text-sm font-mono">{message}</div>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* FREE */}
        <div className="border border-green-600/30 rounded-xl p-8 bg-black/40 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl text-green-400 mb-4">FREE</h2>
            <p className="text-green-200 text-sm leading-relaxed mb-6">
              Базовый доступ для тестирования и личных экспериментов.
              Позволяет изучить структуру API и оценить качество данных.
            </p>
            <p className="text-green-300 text-sm mb-6">
              5 запросов • до 5 карточек за один вызов
            </p>
            <p className="text-green-500 font-semibold mb-2">БЕСПЛАТНО</p>
          </div>
          <button
            onClick={() => handleActivate("free")}
            disabled={loading === "free"}
            className="gc-btn mt-6"
          >
            {loading === "free" ? "Создание..." : "Активировать"}
          </button>
        </div>

        {/* PREMIUM */}
        <div className="border border-green-600/30 rounded-xl p-8 bg-black/40 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl text-green-400 mb-4">PREMIUM</h2>
            <p className="text-green-200 text-sm leading-relaxed mb-6">
              Оптимальный выбор для дизайнеров и небольших студий.
              Расширенные фильтры, выгрузка данных и стабильные лимиты для
              проектов.
            </p>
            <p className="text-green-300 text-sm mb-6">
              20 запросов • до 5 карточек за вызов
            </p>
            <p className="text-green-500 font-semibold mb-2">590 ₽</p>
          </div>
          <button
            onClick={() => handleActivate("premium")}
            disabled={loading === "premium"}
            className="gc-btn mt-6"
          >
            {loading === "premium" ? "Переход..." : "Активировать"}
          </button>
        </div>

        {/* SUPREME */}
        <div className="border border-green-600/30 rounded-xl p-8 bg-black/40 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl text-green-400 mb-4">SUPREME</h2>
            <p className="text-green-200 text-sm leading-relaxed mb-6">
              Полный доступ к экосистеме GreenCore. Пакетные запросы,
              приоритетная обработка и ранний доступ к новым функциям.
            </p>
            <p className="text-green-300 text-sm mb-6">
              100 запросов • до 20 карточек за вызов
            </p>
            <p className="text-green-500 font-semibold mb-2">2 490 ₽</p>
          </div>
          <button
            onClick={() => handleActivate("supreme")}
            disabled={loading === "supreme"}
            className="gc-btn mt-6"
          >
            {loading === "supreme" ? "Переход..." : "Активировать"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .gc-btn {
          display: inline-block;
          width: 100%;
          padding: 0.8rem 1.2rem;
          border-radius: 0.75rem;
          background: linear-gradient(90deg, #3fd67c, #53ff94);
          color: #0e1812;
          font-weight: 700;
          box-shadow: 0 0 12px rgba(83, 255, 148, 0.4),
            inset 0 -2px 6px rgba(0, 0, 0, 0.2);
          transition: all 0.25s ease;
        }
        .gc-btn:hover {
          filter: brightness(1.15);
          box-shadow: 0 0 20px rgba(83, 255, 148, 0.55),
            inset 0 -2px 6px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </main>
  );
}
