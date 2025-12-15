"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  plan: string | null;
  onClose: () => void;
};

export default function EmailModal({ plan, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://web-production-310c7c.up.railway.app";

  // Гарантируем рендер только в браузере
  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC для закрытия
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Введите корректный email");
      return;
    }
    if (!plan) {
      setError("План не выбран");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (plan.toLowerCase() === "free") {
        const res = await fetch(
          `${API_URL}/create_user_key?plan=free&email=${encodeURIComponent(email)}`,
          { method: "POST" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || "Ошибка создания ключа");

        setMessage("API-ключ отправлен на почту. Проверьте входящие и спам.");
      } else {
        const res = await fetch(
          `${API_URL}/api/payment/session?plan=${plan}&email=${encodeURIComponent(email)}`,
          { method: "POST" }
        );
        const data = await res.json();
        if (!res.ok || !data.payment_url)
          throw new Error(data?.detail || "Ошибка создания платежа");

        window.location.href = data.payment_url;
      }
    } catch (e: any) {
      setError(e.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // Портал: всегда поверх любых фоновых ::before/::after и z-index’ов
  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-green-400/40 bg-black/90 p-8 shadow-[0_0_40px_rgba(83,255,148,0.35)]">
        <h2 className="text-2xl text-green-300 mb-6 text-center">Введите email</h2>

        <p className="text-green-200 text-sm mb-6 text-center">
          API-ключ будет отправлен на указанную почту
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/60 border border-green-400/40 text-green-200 outline-none focus:border-green-400"
          disabled={loading}
        />

        {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}
        {message && <div className="mb-4 text-green-400 text-sm text-center">{message}</div>}

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-green-400/40 text-green-300 hover:bg-green-900/30 transition"
          >
            Отмена
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
