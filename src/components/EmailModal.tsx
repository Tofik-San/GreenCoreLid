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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,18,15,0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 999999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: "580px",
          maxHeight: "calc(100vh - 160px)",
          overflowY: "auto",
          margin: "80px auto",
          padding: "44px 46px",
          borderRadius: "24px",
          background: "linear-gradient(180deg, #cbbfa8, #bfb196)",
          border: "1px solid rgba(92,128,98,0.55)",
          boxShadow: "0 28px 70px rgba(0,0,0,0.4)",
          color: "#1c2520",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* BRAND */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: "#2f6b45",
            marginBottom: "8px",
          }}
        >
          GreenCoreAPI
        </div>

        {/* PLAN */}
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "#3f7f55",
            marginBottom: "30px",
            textTransform: "uppercase",
          }}
        >
          {plan}
        </div>

        {!apiKey ? (
          <>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "14px",
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
                padding: "16px 18px",
                borderRadius: "16px",
                background: "#eee8db",
                border: "1px solid rgba(92,128,98,0.65)",
                fontSize: "17px",
                marginBottom: "12px",
              }}
            />

            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                marginBottom: "26px",
              }}
            >
              Внимательно проверьте email перед оплатой
            </div>

            {error && (
              <div
                style={{
                  color: "#8a2e2e",
                  fontSize: "15px",
                  marginBottom: "16px",
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
                padding: "18px",
                borderRadius: "18px",
                background: loading
                  ? "#9faa9f"
                  : "linear-gradient(90deg,#4f8f64,#6fae7e)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "17px",
                cursor: loading ? "default" : "pointer",
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
                  marginTop: "18px",
                  fontSize: "14px",
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
                marginBottom: "12px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Ваш API-ключ:
            </div>

            <div
              style={{
                wordBreak: "break-all",
                padding: "16px",
                borderRadius: "16px",
                background: "#eee8db",
                border: "1px solid rgba(92,128,98,0.65)",
                marginBottom: "14px",
                fontSize: "15px",
              }}
            >
              {apiKey}
            </div>

            <button
              onClick={handleCopy}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "16px",
                background: copied
                  ? "#7fae8c"
                  : "linear-gradient(90deg,#5a8f6f,#79b08a)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                border: "none",
                marginBottom: "14px",
              }}
            >
              {copied ? "Скопировано ✓" : "Скопировать API-ключ"}
            </button>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "18px",
                background: "linear-gradient(90deg,#4f8f64,#6fae7e)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "17px",
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
