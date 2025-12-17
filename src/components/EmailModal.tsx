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
          maxWidth: "540px",
          margin: "100px auto",
          padding: "44px",
          borderRadius: "24px",
          background: "linear-gradient(180deg,#cbbfa8,#bfb196)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!apiKey ? (
          <button
            onClick={() => setApiKey("TEST_API_KEY")}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "16px",
              background: "#4f8f64",
              color: "#fff",
              fontWeight: 700,
              border: "none",
            }}
          >
            Сымитировать ключ
          </button>
        ) : (
          <>
            <div
              style={{
                wordBreak: "break-all",
                padding: "16px",
                background: "#eee8db",
                borderRadius: "12px",
                marginBottom: "12px",
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
                background: copied ? "#7fbf96" : "#4f8f64",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                marginBottom: "10px",
              }}
            >
              {copied ? "✓ Скопировано" : "Скопировать"}
            </button>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                background: "#666",
                color: "#fff",
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
