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
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,24,22,0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "560px",
          padding: "48px 52px",
          borderRadius: "28px",
          background: "#f5efe4",
          border: "1.5px solid #9fc3ab",
          boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Inter, Roboto, sans-serif",
          color: "#1f2a24",
        }}
      >
        {/* декоративные линии */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(600px 240px at -10% 10%, rgba(130,180,150,0.25), transparent 60%)," +
              "radial-gradient(520px 220px at 110% 90%, rgba(130,180,150,0.22), transparent 60%)",
            pointerEvents: "none",
            borderRadius: "28px",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* бренд */}
          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#2e5b45",
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            GreenCore-API
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: "#6a907c",
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
                  fontSize: "17px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
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
                  borderRadius: "14px",
                  border: "1px solid #9fc3ab",
                  background: "#faf7f1",
                  fontSize: "16px",
                  color: "#1f2a24",
                  outline: "none",
                  marginBottom: "14px",
                }}
              />

              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#3b4a43",
                  marginBottom: "24px",
                  textAlign: "center",
                }}
              >
                Убедитесь, что email введён корректно
              </div>

              {error && (
                <div
                  style={{
                    color: "#8a2e2e",
                    fontSize: "14px",
                    marginBottom: "16px",
                    textAlign: "center",
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
                  border: "none",
                  background: loading ? "#b7c6be" : "#6fae8a",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
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
                <div
                  style={{
                    marginTop: "18px",
                    fontSize: "13px",
                    color: "#3b4a43",
                    textAlign: "center",
                  }}
                >
                  API-ключ будет отправлен на почту после оплаты
                </div>
              )}
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                Ваш API-ключ
              </div>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: "#faf7f1",
                  border: "1px solid #9fc3ab",
                  fontSize: "14px",
                  wordBreak: "break-all",
                  marginBottom: "18px",
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
                  border: "none",
                  background: copied ? "#86bfa0" : "#6fae8a",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "14px",
                  cursor: "pointer",
                }}
              >
                {copied ? "Скопировано ✓" : "Скопировать ключ"}
              </button>

              <button
                onClick={onClose}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "none",
                  background: "#5f9b75",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
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
