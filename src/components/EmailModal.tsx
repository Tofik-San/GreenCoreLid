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

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        if (!res.ok || !data?.api_key) {
          throw new Error(data?.detail || "Ошибка получения ключа");
        }

        setApiKey(data.api_key);
        return;
      }

      if (isPaid) {
        const res = await fetch(`${API_URL}/api/payment/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: normalizedPlan, email }),
        });

        const data = await res.json();

        if (!res.ok || !data?.confirmation_url) {
          throw new Error("Не удалось создать платёжную сессию");
        }

        window.location.href = data.confirmation_url;
      }
    } catch (e: any) {
      setError(e.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const borderBox = { boxSizing: "border-box" as const };

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
          maxWidth: "540px",
          margin: "100px auto",
          padding: "44px 46px",
          borderRadius: "24px",
          background: "linear-gradient(180deg,#cbbfa8,#bfb196)",
          border: "1px solid rgba(92,128,98,0.55)",
          boxShadow: "0 28px 70px rgba(0,0,0,0.4)",
          textAlign: "center",
          ...borderBox,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
          GreenCoreAPI
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 26,
            letterSpacing: "0.18em",
          }}
        >
          {plan}
        </div>

        {!apiKey ? (
          <>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>
              Введите вашу почту
            </div>

            <input
              type="email"
              value={email}
              placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: "16px",
                background: "#eee8db",
                border: "1px solid rgba(92,128,98,0.65)",
                fontSize: "16px",
                marginBottom: "20px",
                outline: "none",
                ...borderBox,
              }}
            />

            {error && (
              <div style={{ color: "#8a2e2e", marginBottom: 16 }}>
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
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                cursor: loading ? "default" : "pointer",
                ...borderBox,
              }}
            >
              {loading ? "Подождите..." : "Получить API-ключ"}
            </button>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>
              Ваш API-ключ
            </div>

            <div
              style={{
                wordBreak: "break-all",
                padding: 16,
                borderRadius: 16,
                background: "#eee8db",
                marginBottom: 14,
                fontSize: 14,
                ...borderBox,
              }}
            >
              {apiKey}
            </div>

            <button
              onClick={handleCopy}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                background: copied
                  ? "#7fbf9b"
                  : "linear-gradient(90deg,#4f8f64,#6fae7e)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                marginBottom: 12,
                ...borderBox,
              }}
            >
              {copied ? "Скопировано ✓" : "Скопировать"}
            </button>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                background: "#5c6f63",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                ...borderBox,
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
