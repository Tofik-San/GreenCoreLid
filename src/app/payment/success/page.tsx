"use client";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [key, setKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKey() {
      try {
        const res = await fetch(
          "https://web-production-310c7c.up.railway.app/api/payments/latest?email=test@example.com"
        );
        const data = await res.json();
        if (data?.api_key) setKey(data.api_key);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchKey();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start text-center bg-black relative overflow-hidden px-6 pt-[12vh] pb-[8vh]">
      {/* фон свечения */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(83,255,148,0.06),transparent_80%)] pointer-events-none" />

      {/* заголовок */}
      <h1 className="text-5xl font-bold mb-10 text-green-300 drop-shadow-[0_0_20px_rgba(83,255,148,0.6)] animate-pulse">
        Оплата прошла успешно
      </h1>

      {/* блок ключа */}
      {loading && <p className="text-green-300 mt-6">Обработка платежа...</p>}

      {!loading && key && (
        <>
          <p className="text-green-200 mb-4 text-lg">Ваш API-ключ:</p>

          <div
            className="relative mb-12"
            style={{
              width: "80vw",
              maxWidth: "1100px",
              minWidth: "720px",
              background:
                "linear-gradient(180deg, rgba(12,20,14,0.85), rgba(18,26,20,0.9))",
              border: "1px solid rgba(83,255,148,0.25)",
              borderRadius: "14px",
              boxShadow: "0 0 20px rgba(83,255,148,0.15)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              overflowX: "auto",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "18px",
                color: "#9effb5",
                textShadow: "0 0 6px rgba(83,255,148,0.4)",
                userSelect: "text",
                whiteSpace: "nowrap",
                flexGrow: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {key}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(key || "")}
              style={{
                marginLeft: "20px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(83,255,148,0.15)",
                border: "1px solid rgba(83,255,148,0.3)",
                color: "#aaffc8",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(83,255,148,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(83,255,148,0.15)")
              }
            >
              Копировать
            </button>
          </div>
        </>
      )}

      {!loading && !key && (
        <p className="text-green-300 mt-4">
          Ключ пока не найден. Обновите страницу через несколько секунд.
        </p>
      )}

      {/* кнопка */}
      <a
        href="/search"
        style={{
          display: "inline-block",
          padding: "20px 60px",
          borderRadius: "9999px",
          background: "linear-gradient(90deg,#3fd67c,#53ff94)",
          color: "#04140a",
          fontWeight: 600,
          fontSize: "20px",
          marginTop: "90px",
          boxShadow: "0 0 22px rgba(83,255,148,0.45)",
          textDecoration: "none",
          transition: "filter 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = "brightness(1.1)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = "brightness(1)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Перейти к поиску растений
      </a>
    </main>
  );
}
