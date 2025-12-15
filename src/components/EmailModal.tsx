"use client";

import { useState } from "react";

type Props = {
  plan: string | null;
  onClose: () => void;
};

export default function EmailModal({ plan, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://web-production-310c7c.up.railway.app";

  const normalizedPlan = plan?.toLowerCase() || "";
  const isFree = normalizedPlan === "free";
  const isPaid = normalizedPlan === "premium" || normalizedPlan === "supreme";

  const validateEmail = (value: string) =>
    value.includes("@") && value.includes(".");

  const handleSubmit = async () => {
    setError(null);

    if (!validateEmail(email)) {
      setError("Введите корректный email");
      return;
    }

    try {
      setLoading(true);

      // ────────────────────────────────
      // FREE — создаём ключ сразу
      // ────────────────────────────────
      if (isFree) {
        const res = await fetch(
          `${API_URL}/create_user_key?plan=free&email=${encodeURIComponent(
            email
          )}`,
          { method: "POST" }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.detail || "Ошибка при создании ключа");
        }

        if (!data?.api_key) {
          throw new Error("API-ключ не получен");
        }

        setApiKey(data.api_key);
        return;
      }

      // ────────────────────────────────
      // PAID — уходим в YooKassa
      // ────────────────────────────────
      if (isPaid) {
        const res = await fetch(`${API_URL}/api/payment/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: normalizedPlan,
            email,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data?.confirmation_url) {
          throw new Error("Не удалось создать платёжную сессию");
        }

        // редиректим пользователя
        window.location.href = data.confirmation_url;
        return;
      }

      setError("Неизвестный тариф");
    } catch (e: any) {
      setError(e.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        zIndex: 999999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#000",
          color: "#0f0",
          padding: "32px",
          width: "460px",
          margin: "120px auto",
          textAlign: "center",
          fontSize: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "12px", fontSize: "18px" }}>
          PLAN: {plan}
        </div>

        {!apiKey ? (
          <>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                background: "#111",
                color: "#0f0",
                border: "1px solid #0f0",
              }}
            />

            {error && (
              <div style={{ color: "#f55", marginBottom: "12px" }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "#333" : "#0f0",
                color: "#000",
                fontWeight: "bold",
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading
                ? "Подождите..."
                : isFree
                ? "Получить API-ключ"
                : "Перейти к оплате"}
            </button>

            {!isFree && (
              <div style={{ marginTop: "10px", fontSize: "12px", color: "#6f6" }}>
                После оплаты API-ключ будет отправлен на почту
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ marginBottom: "8px" }}>Ваш API-ключ:</div>
            <div
              style={{
                wordBreak: "break-all",
                padding: "12px",
                border: "1px solid #0f0",
                marginBottom: "12px",
              }}
            >
              {apiKey}
            </div>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "12px",
                background: "#0f0",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Закрыть
            </button>
          </>
        )}
      </div>
    </div>
  );
}
