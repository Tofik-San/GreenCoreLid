"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { createPortal } from "react-dom";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"loading" | "ok" | "error">("loading");
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setPortalTarget(document.body);

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

  const closeModal = () => setOpenModal(null);

  const renderModalContent = (kind: string) => {
    switch (kind) {
      case "about":
        return (
          <>
            <h2 className="text-2xl mb-4 text-green-300">О проекте</h2>
            <p className="text-sm leading-relaxed text-green-200/90">
              GreenCore — цифровое ядро ботанических знаний, объединяющее агротехнику, данные и экологию.
              Проект создаёт интеллектуальную инфраструктуру для устойчивого озеленения, точного ухода и автоматизации анализа растений.
            </p>
          </>
        );
      case "features":
        return (
          <>
            <h2 className="text-2xl mb-4 text-green-300">Возможности</h2>
            <p className="text-sm leading-relaxed text-green-200/90">
              • Динамическая база растений с фильтрацией по свету, температуре и токсичности.<br />
              • Генерация карточек сортов по видам.<br />
              • API для интеграции с ботами, сайтами и системами ландшафтного проектирования.<br />
              • Поддержка тарифных планов и лимитов по API-ключам.
            </p>
          </>
        );
      case "privacy":
        return (
          <>
            <h2 className="text-2xl mb-4 text-green-300">Политика конфиденциальности</h2>
            <p className="text-sm leading-relaxed text-green-200/90">
              GreenCore API не собирает личные данные пользователей, кроме технических логов (ключ, IP, запросы).
              Эти данные используются исключительно для защиты и аналитики.
              Контакт для вопросов: greencore.api@gmail.com.
            </p>
          </>
        );
      case "terms":
        return (
          <>
            <h2 className="text-2xl mb-4 text-green-300">Условия использования</h2>
            <p className="text-sm leading-relaxed text-green-200/90">
              Используя GreenCore API, вы соглашаетесь соблюдать честные принципы использования данных,
              не распространять ключи третьим лицам и не копировать базу.
              Доступ предоставляется «как есть», без гарантий.
              Разработчик оставляет за собой право изменять условия.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const modal =
    portalTarget && openModal
      ? createPortal(
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999]"
            onClick={closeModal}
          >
            <div
              className="bg-green-950/90 border border-green-700 text-green-100 p-8 rounded-2xl max-w-2xl w-[92%] shadow-[0_0_30px_rgba(83,255,148,0.4)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-green-400 hover:text-green-200 text-lg"
              >
                ✕
              </button>
              {renderModalContent(openModal)}
            </div>
          </div>,
          portalTarget
        )
      : null;

  return (
    <>
      <main className="gc-hero flex flex-col items-center justify-center px-6 text-center py-12 overflow-hidden">
        <div className="max-w-3xl fade-in-up">
          <h1
            className="gc-title gc-hero-title fade-in-up text-[clamp(56px,9vw,132px)] mb-4"
            style={{ filter: "brightness(1.2)" }}
          >
            GreenCore API
          </h1>

          {/* Индикатор состояния API */}
          <div className="mt-[-10px] mb-6 flex items-center justify-center gap-2 fade-in-up" style={{ animationDelay: "0.15s" }}>
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
            <span className="text-green-200 text-sm" style={{ fontFamily: "monospace" }}>
              {apiStatus === "ok"
                ? "API online"
                : apiStatus === "error"
                ? "API offline"
                : "Проверка соединения..."}
            </span>
          </div>

          <div
            className="gc-subtitle fade-in-up text-green-100 text-center leading-relaxed select-none"
            style={{ animationDelay: "0.3s" }}
          >
            Мы соединяем ботанику и технологию.<br />
            <strong className="text-green-400">GreenCore</strong> — цифровое ядро знаний о растениях.<br />
            Платформа объединяет научные данные, агротехнику и реальный опыт ухода,<br />
            формируя интеллектуальную инфраструктуру устойчивого озеленения и умных экосистем.<br />
            <span
              className="text-green-300"
              style={{
                textShadow: "0 0 12px rgba(83,255,148,0.45), 0 0 32px rgba(83,255,148,0.25)",
                fontWeight: 600,
              }}
            >
              GreenCore делает знание измеримым, уход — предсказуемым, а природу —
              управляемой с точностью науки.
            </span>
          </div>

          {/* Кнопка перехода к документации */}
          <div className="flex justify-center mt-10 mb-6 fade-in-up" style={{ animationDelay: "0.45s" }}>
            <Link href="/docs" className="gc-btn">
              Перейти к документации
            </Link>
          </div>

          {/* Кнопки-модалки */}
          <div className="flex flex-wrap justify-center gap-5 mt-6 mb-10 fade-in-up" style={{ animationDelay: "0.6s" }}>
            {[
              { id: "about", label: "О проекте" },
              { id: "features", label: "Возможности" },
              { id: "privacy", label: "Политика конфиденциальности" },
              { id: "terms", label: "Условия использования" },
            ].map((btn) => (
              <button key={btn.id} onClick={() => setOpenModal(btn.id)} className="floating-buttons-style" type="button">
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <Footer />
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

      {modal}
    </>
  );
}
