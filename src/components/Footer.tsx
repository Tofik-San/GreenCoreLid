"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Footer() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = () => setOpenModal(null);

  const Modal = ({ kind }: { kind: string }) => {
    if (!mounted) return null;
    return createPortal(
      <div
        className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center"
        onClick={close}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-green-950/90 border border-green-700 text-green-100 p-8 rounded-2xl max-w-2xl w-[92%] shadow-[0_0_30px_rgba(83,255,148,0.4)] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={close}
            className="absolute top-3 right-3 text-green-400 hover:text-green-200 text-lg"
            aria-label="Закрыть"
            type="button"
          >
            ✕
          </button>

          {kind === "about" && (
            <>
              <h2 className="text-2xl mb-4 text-green-300">О проекте</h2>
              <p className="text-sm leading-relaxed text-green-200/90">
                GreenCore — цифровое ядро ботанических знаний, объединяющее агротехнику, данные и экологию.
                Проект создаёт интеллектуальную инфраструктуру для устойчивого озеленения,
                точного ухода и автоматизации анализа растений.
              </p>
            </>
          )}

          {kind === "features" && (
            <>
              <h2 className="text-2xl mb-4 text-green-300">Возможности</h2>
              <p className="text-sm leading-relaxed text-green-200/90">
                • Динамическая база растений с фильтрами по свету, температуре и токсичности.<br />
                • Генерация карточек сортов по видам.<br />
                • API для интеграций (боты, сайты, CAD/ландшафтные системы).<br />
                • Тарифы и лимиты по API-ключам.
              </p>
            </>
          )}

          {kind === "privacy" && (
            <>
              <h2 className="text-2xl mb-4 text-green-300">Политика конфиденциальности</h2>
              <p className="text-sm leading-relaxed text-green-200/90">
                Храним только технические логи (ключ, IP, запросы) для защиты и аналитики.
                Персональные данные не собираются. Контакт: greencore.api@gmail.com.
              </p>
            </>
          )}

          {kind === "terms" && (
            <>
              <h2 className="text-2xl mb-4 text-green-300">Условия использования</h2>
              <p className="text-sm leading-relaxed text-green-200/90">
                Используя GreenCore API, вы не передаёте ключи третьим лицам и не копируете базу.
                Доступ предоставляется «как есть», без гарантий. Условия могут обновляться.
              </p>
            </>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <footer className="w-full py-10 text-center text-sm text-green-400 border-t border-green-800/50 bg-transparent relative">
      <p className="mb-6">© {new Date().getFullYear()} GreenCore — цифровая ботаника нового уровня.</p>

      <div className="flex flex-wrap justify-center gap-5">
        {[
          { id: "about", label: "О проекте" },
          { id: "features", label: "Возможности" },
          { id: "privacy", label: "Политика конфиденциальности" },
          { id: "terms", label: "Условия использования" },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setOpenModal(btn.id)}
            className="floating-buttons-style px-6 py-2.5 rounded-xl font-medium text-green-100 pointer-events-auto
                       transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {openModal && <Modal kind={openModal} />}
    </footer>
  );
}
