"use client";
import { useState } from "react";

export default function Footer() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const closeModal = () => setOpenModal(null);

  return (
    <footer className="w-full py-10 text-center text-sm text-green-400 border-t border-green-800/50 bg-transparent relative">
      <p className="mb-6">
        © {new Date().getFullYear()} GreenCore — цифровая ботаника нового уровня.
      </p>

      {/* Кнопки, стилизованные как плавающие */}
      <div className="flex flex-wrap justify-center gap-5">
        {[
          { id: "about", label: "О проекте" },
          { id: "features", label: "Возможности" },
          { id: "privacy", label: "Политика конфиденциальности" },
          { id: "terms", label: "Условия использования" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setOpenModal(btn.id)}
            className="floating-buttons-style px-6 py-2.5 rounded-xl font-medium text-green-100
                       transition-transform duration-300 hover:scale-105 focus:outline-none active:scale-95"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Модальные окна */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-green-950/90 border border-green-700 text-green-100 p-8 rounded-2xl max-w-2xl shadow-[0_0_30px_rgba(83,255,148,0.4)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-green-400 hover:text-green-200 text-lg"
            >
              ✕
            </button>

            {openModal === "about" && (
              <>
                <h2 className="text-2xl mb-4 text-green-300">О проекте</h2>
                <p className="text-sm leading-relaxed text-green-200/90">
                  GreenCore — цифровое ядро ботанических знаний, объединяющее агротехнику, данные и экологию.
                  Проект создаёт интеллектуальную инфраструктуру для устойчивого озеленения,
                  точного ухода и автоматизации анализа растений.
                </p>
              </>
            )}

            {openModal === "features" && (
              <>
                <h2 className="text-2xl mb-4 text-green-300">Возможности</h2>
                <p className="text-sm leading-relaxed text-green-200/90">
                  • Динамическая база растений с фильтрацией по свету, температуре и токсичности.<br />
                  • Генерация карточек сортов по видам.<br />
                  • API для интеграции с ботами, сайтами и системами ландшафтного проектирования.<br />
                  • Поддержка тарифных планов и лимитов по API-ключам.
                </p>
              </>
            )}

            {openModal === "privacy" && (
              <>
                <h2 className="text-2xl mb-4 text-green-300">Политика конфиденциальности</h2>
                <p className="text-sm leading-relaxed text-green-200/90">
                  GreenCore API не собирает личные данные пользователей, кроме технических логов (ключ, IP, запросы).
                  Эти данные используются исключительно для защиты и аналитики.
                  Контакт для вопросов: greencore.api@gmail.com.
                </p>
              </>
            )}

            {openModal === "terms" && (
              <>
                <h2 className="text-2xl mb-4 text-green-300">Условия использования</h2>
                <p className="text-sm leading-relaxed text-green-200/90">
                  Используя GreenCore API, вы соглашаетесь соблюдать честные принципы использования данных,
                  не распространять ключи третьим лицам и не копировать базу.
                  Доступ предоставляется «как есть», без гарантий.
                  Разработчик оставляет за собой право изменять условия.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
