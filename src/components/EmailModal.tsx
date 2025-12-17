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
        background: "rgba(10,14,12,0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 999999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "600px",
          maxHeight: "calc(100vh - 160px)",
          overflowY: "auto",
          margin: "80px auto",
          padding: "48px 52px",
          borderRadius: "28px",
          background: "#f4efe6",
          border: "1.5px solid rgba(110,160,120,0.65)",
          boxShadow: "0 22px 48px rgba(0,0,0,0.22)",
          color: "#1f2a24",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* DECORATIVE ECO LINES */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(600px 220px at -5% 15%, rgba(90,150,110,0.28), transparent 65%)," +
              "radial-gradient(520px 200px at 105% 90%, rgba(90,150,110,0.24), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* BRAND */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#244d36",
              marginBottom: "6px",
            }}
          >
            GreenCoreAPI
          </div>

          {/* PLAN */}
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: "#4f7f64",
              marginBottom: "36px",
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
                  marginBottom: "18px",
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
                  borderRadius: "14px",
                  background: "#faf8f3",
                  border: "1px solid rgba(110,160,120,0.55)",
                  fontSize: "16px",
                  fontWeight: 500,
                  outline: "none",
                  marginBottom: "16px",
                  color: "#1f2a24",
                }}
              />

              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#39453e",
                  marginBottom: "28px",
                }}
              >
                Внимательно проверьте email перед оплатой
              </div>

              {error && (
                <div
                  style={{
                    color: "#8a2e2e",
                    fontSize: "15px",
                    marginBottom: "18px",
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
                  background: loading ? "#a7b6ae" : "#5f9b75",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "16px",
                  letterSpacing: "0.04em",
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
                    marginTop: "20px",
                    fontSize: "14px",
                    color: "#39453e",
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
                  marginBottom: "14px",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                Ваш API-ключ
              </div>

              <div
                style={{
                  wordBreak: "break-all",
                  padding: "16px",
                  borderRadius: "14px",
                  background: "#faf8f3",
                  border: "1px solid rgba(110,160,120,0.55)",
                  marginBottom: "18px",
                  fontSize: "14px",
                  fontWeight: 500,
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
                  background: copied ? "#7fb08f" : "#6aa887",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "15px",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  border: "none",
                  marginBottom: "18px",
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
                  background: "#5f9b75",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "16px",
                  letterSpacing: "0.04em",
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
    </div>
  );
}
