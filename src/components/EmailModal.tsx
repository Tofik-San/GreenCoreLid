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
        background: "rgba(20,30,22,0.55)",
        backdropFilter: "blur(6px)",
        zIndex: 999999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "120px auto",
          padding: "36px 34px",
          borderRadius: "20px",
          background: "linear-gradient(180deg,#f4f1ea,#ede8dc)",
          border: "1px solid rgba(95,163,106,0.35)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          color: "#2a3a2f",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* BRAND */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#3f7f4a",
            marginBottom: "10px",
          }}
        >
          GreenCoreAPI
        </div>

        {/* PLAN */}
        <div
          style={{
            fontSize: "13px",
            letterSpacing: "0.22em",
            color: "#5fa36a",
            marginBottom: "26px",
            textTransform: "uppercase",
          }}
        >
          {plan}
        </div>

        {!apiKey ? (
          <>
            {/* LABEL */}
            <div
              style={{
                fontSize: "15px",
                marginBottom: "10px",
                color: "#2a3a2f",
              }}
            >
              Введите вашу почту
            </div>

            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#faf8f3",
                border: "1px solid rgba(95,163,106,0.45)",
                color: "#2a3a2f",
                fontSize: "15px",
                outline: "none",
                marginBottom: "8px",
                boxShadow: "inset 0 1px 4px rgba(0,0,0,0.08)",
              }}
            />

            {/* WARNING */}
            <div
              style={{
                fontSize: "12px",
                color: "#5c6f63",
                marginBottom: "18px",
              }}
            >
              Внимательно проверьте email перед оплатой
            </div>

            {error && (
              <div style={{ color: "#b94a4a", marginBottom: "12px" }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                background: loading
                  ? "#cfd8cf"
                  : "linear-gradient(90deg,#5fa36a,#7fbf8a)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "15px",
                cursor: loading ? "default" : "pointer",
                boxShadow: "0 6px 18px rgba(95,163,106,0.35)",
                border: "none",
              }}
            >
              {loading
                ? "Подождите..."
                : isFree
                ? "Получить API-ключ"
                : "Перейти к оплате"}
            </button>

            {!isFree && (
              <div
                style={{
                  marginTop: "14px",
                  fontSize: "12px",
                  color: "#6b7d72",
                }}
              >
                После оплаты API-ключ будет отправлен на почту
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ marginBottom: "8px", fontWeight: 500 }}>
              Ваш API-ключ:
            </div>
            <div
              style={{
                wordBreak: "break-all",
                padding: "12px",
                borderRadius: "12px",
                background: "#faf8f3",
                border: "1px solid rgba(95,163,106,0.45)",
                marginBottom: "16px",
                color: "#2a3a2f",
                boxShadow: "inset 0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {apiKey}
            </div>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                background: "linear-gradient(90deg,#5fa36a,#7fbf8a)",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                boxShadow: "0 6px 18px rgba(95,163,106,0.35)",
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
