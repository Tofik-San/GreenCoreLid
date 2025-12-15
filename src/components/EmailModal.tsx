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
        background: "rgba(15, 20, 16, 0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 999999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "110px auto",
          padding: "40px 42px",
          borderRadius: "22px",
          background: "linear-gradient(180deg, #d8cfbd, #cfc4ad)",
          border: "1px solid rgba(92, 128, 98, 0.45)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          color: "#1f2a24",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* BRAND */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#2f6b45",
            marginBottom: "6px",
          }}
        >
          GreenCoreAPI
        </div>

        {/* PLAN */}
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "0.2em",
            color: "#4e7f5f",
            marginBottom: "28px",
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
                fontSize: "16px",
                marginBottom: "12px",
                fontWeight: 500,
                color: "#1f2a24",
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
                padding: "14px 16px",
                borderRadius: "14px",
                background: "#f3efe6",
                border: "1px solid rgba(92,128,98,0.55)",
                color: "#1f2a24",
                fontSize: "16px",
                outline: "none",
                marginBottom: "10px",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.12)",
              }}
            />

            {/* WARNING */}
            <div
              style={{
                fontSize: "13px",
                lineHeight: 1.5,
                color: "#3e4f45",
                marginBottom: "22px",
              }}
            >
              Внимательно проверьте email перед оплатой
            </div>

            {error && (
              <div
                style={{
                  color: "#8a2e2e",
                  fontSize: "14px",
                  marginBottom: "14px",
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                background: loading
                  ? "#a9b7ad"
                  : "linear-gradient(90deg,#4f8f64,#6fae7e)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "16px",
                cursor: loading ? "default" : "pointer",
                boxShadow: "0 8px 22px rgba(79,143,100,0.45)",
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
                  marginTop: "16px",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: "#3f4f46",
                }}
              >
                После оплаты API-ключ будет отправлен на почту
              </div>
            )}
          </>
        ) : (
          <>
            <div
              style={{
                marginBottom: "10px",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              Ваш API-ключ:
            </div>
            <div
              style={{
                wordBreak: "break-all",
                padding: "14px",
                borderRadius: "14px",
                background: "#f3efe6",
                border: "1px solid rgba(92,128,98,0.55)",
                marginBottom: "18px",
                fontSize: "14px",
                color: "#1f2a24",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.12)",
              }}
            >
              {apiKey}
            </div>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                background: "linear-gradient(90deg,#4f8f64,#6fae7e)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "16px",
                cursor: "pointer",
                border: "none",
                boxShadow: "0 8px 22px rgba(79,143,100,0.45)",
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
