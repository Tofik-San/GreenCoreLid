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
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 999999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "120px auto",
          padding: "32px",
          borderRadius: "18px",
          background: "linear-gradient(180deg, rgba(12,20,14,0.95), rgba(8,14,10,0.98))",
          border: "1px solid rgba(83,255,148,0.18)",
          boxShadow: "0 0 40px rgba(0,0,0,0.85)",
          color: "#c6f7cb",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* BRAND */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#8effa9",
            marginBottom: "14px",
          }}
        >
          GreenCoreAPI
        </div>

        {/* PLAN */}
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "0.2em",
            color: "#6fdc95",
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
                color: "#bde6c2",
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
                borderRadius: "10px",
                background: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(83,255,148,0.35)",
                color: "#c6f7cb",
                fontSize: "15px",
                outline: "none",
                marginBottom: "8px",
              }}
            />

            {/* WARNING */}
            <div
              style={{
                fontSize: "12px",
                color: "rgba(169,216,178,0.75)",
                marginBottom: "18px",
              }}
            >
              Внимательно проверьте email перед оплатой
            </div>

            {error && (
              <div style={{ color: "#ff7b7b", marginBottom: "12px" }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: loading
                  ? "rgba(83,255,148,0.25)"
                  : "linear-gradient(90deg,#3fd67c,#53ff94)",
                color: "#0b1a0f",
                fontWeight: 600,
                fontSize: "15px",
                cursor: loading ? "default" : "pointer",
                boxShadow: "0 0 14px rgba(83,255,148,0.35)",
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
                  color: "rgba(169,216,178,0.75)",
                }}
              >
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
                borderRadius: "10px",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(83,255,148,0.35)",
                marginBottom: "14px",
              }}
            >
              {apiKey}
            </div>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "linear-gradient(90deg,#3fd67c,#53ff94)",
                color: "#0b1a0f",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
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
