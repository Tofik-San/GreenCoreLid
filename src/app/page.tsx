"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"loading" | "ok" | "error">("loading");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://web-production-310c7cup.railway.app";

    fetch(`${API_URL}/health`)
      .then((res) => {
        if (!res.ok) throw new Error("API не отвечает");
        return res.json();
      })
      .then((data) => {
        if (data.status === "ok") setApiStatus("ok");
        else setApiStatus("error");
      })
      .catch(() => setApiStatus("error"));
  }, []);

  return (
    <>
      <main className="gc-hero flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-3xl">
          <h1
            className="gc-title gc-hero-title text-[clamp(56px,9vw,132px)] mb-6 mt-[-150px]"
            style={{ filter: "brightness(1.2)" }}
          >
            GreenCore API
          </h1>

          {/* Индикатор состояния API */}
          <div className="mt-[-40px] mb-8 flex items-center justify-center gap-2">
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor:
                  apiStatus === "ok"
                    ? "#4ade80"
                    : apiStatus === "error"
                    ? "#ef4444"
                    : "#facc15",
                boxShadow:
                  apiStatus === "ok"
                    ? "0 0 8px #4ade80"
                    : apiStatus === "error"
                    ? "0 0 8px #ef4444"
                    : "0 0 8px #facc15",
              }}
            />
            <span
              className="text-green-200 text-sm"
              style={{ fontFamily: "monospace" }}
            >
              {apiStatus === "ok"
                ? "API online"
                : apiStatus === "error"
                ? "API offline"
                : "Проверка соединения..."}
            </span>
          </div>

          <div
            className="gc-subtitle text-green-100 text-center leading-relaxed select-none"
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              marginTop: "12px",
              maxWidth: "680px",
              textAlign: "center",
            }}
          >
            Мы соединяем ботанику и технологию.<br />
            <strong className="text-green-400">GreenCore</strong> — цифровое ядро знаний о растениях.<br />
            Платформа объединяет научные данные, агротехнику и реальный опыт ухода,<br />
            формируя интеллектуальную инфраструктуру устойчивого озеленения и умных экосистем.<br />
            <span
              className="text-green-300"
              style={{
                textShadow:
                  "0 0 12px rgba(83,255,148,0.45), 0 0 32px rgba(83,255,148,0.25)",
                fontWeight: 600,
              }}
            >
              GreenCore делает знание измеримым, уход — предсказуемым, а природу —
              управляемой с точностью науки.
            </span>
          </div>

          {/* Кнопка перехода к документации */}
          <div className="flex justify-center mt-10">
            <Link
              href="/docs"
              className="gc-btn"
              style={{
                fontSize: "16px",
                padding: "0.9rem 1.8rem",
                borderRadius: "1rem",
                marginTop: "40px",
                boxShadow:
                  "0 0 14px rgba(173,255,83,0.4), inset 0 -3px 8px rgba(0,0,0,0.25)",
                letterSpacing: "0.5px",
              }}
            >
              Перейти к документации
            </Link>
          </div>
        </div>
      </main>

      <div className="petal-field">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 200}px`,
              animationDelay: `${i * 2.5}s`,
              animationDuration: `${10 + Math.random() * 6}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Кнопки (теперь открывают модалки) */}
      <div className="floating-buttons">
        <button onClick={() => setActiveModal("about")}>О проекте</button>
        <button onClick={() => setActiveModal("features")}>Возможности</button>
        <button onClick={() => setActiveModal("contacts")}>Контакты</button>
      </div>

      {/* Модальные окна */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999999]"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#0d1b0f] border border-[#53ff94]/40 rounded-2xl p-8 w-[90%] max-w-lg text-[#a8ffb0] text-center shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-[#53ff94] text-lg"
              onClick={() => setActiveModal(null)}
            >
              ✕
            </button>

            {activeModal === "about" && (
              <>
                <h2 className="text-2xl mb-3 text-[#53ff94]">О проекте</h2>
                <p>
                  GreenCore — цифровое ядро знаний о растениях. Платформа объединяет
                  ботанику, агротехнику и искусственный интеллект для точного подбора ухода.
                </p>
              </>
            )}
            {activeModal === "features" && (
              <>
                <h2 className="text-2xl mb-3 text-[#53ff94]">Возможности</h2>
                <p>
                  Система фильтров, API-доступ, интеграции с ботами и визуальными
                  инструментами для проектирования экосистем.
                </p>
              </>
            )}
            {activeModal === "contacts" && (
              <>
                <h2 className="text-2xl mb-3 text-[#53ff94]">Контакты</h2>
                <p>
                  Email: info@greencore.ai<br />
                  Telegram: @greencore_bot
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
