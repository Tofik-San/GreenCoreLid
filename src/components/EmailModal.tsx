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

  const validateEmail = (v: string) => v.includes("@") && v.includes(".");

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
          `${API_URL}/create_user_key?plan=free&email=${encodeURIComponent(email)}`,
          { method: "POST" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || "Ошибка");
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
        if (!res.ok || !data?.confirmation_url)
          throw new Error("Ошибка оплаты");
        window.location.href = data.confirmation_url;
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
          maxWidth: 540,
          margin: "100px auto",
          padding: 44,
          borderRadius: 24,
          background: "linear-gradient(180deg,#cbbfa8,#bfb196)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!apiKey ? (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              style={{ width: "100%", padding: 16, marginBottom: 12 }}
            />
            {error && <div style={{ color: "#8a2e2e" }}>{error}</div>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", padding: 16 }}
            >
              {loading
                ? "Подождите..."
                : isFree
                ? "Получить API-ключ"
                : "Перейти к оплате"}
            </button>
          </>
        ) : (
          <>
            <div style={{ wordBreak: "break-all", marginBottom: 12 }}>
              {apiKey}
            </div>
            <button
              onClick={handleCopy}
              style={{ width: "100%", padding: 14, marginBottom: 10 }}
            >
              {copied ? "✓ Скопировано" : "Скопировать API-ключ"}
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: 14 }}>
              Закрыть
            </button>
          </>
        )}
      </div>
    </div>
  );
}
