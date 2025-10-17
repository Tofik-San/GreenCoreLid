"use client";
import { useEffect, useState } from "react";

export default function DocsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://web-production-310c7cup.railway.app";

  useEffect(() => {
    fetch(`${API_URL}/plans`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center py-16">
      <h1 className="text-5xl font-bold mb-6 text-green-300">📘 Документация API</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="w-full max-w-3xl space-y-6">
          {plans.length > 0 ? (
            plans.map((p, i) => (
              <div key={i} className="border border-green-600 p-4 rounded-xl bg-neutral-900">
                <h2 className="text-2xl font-bold text-green-300 mb-2">{p.name}</h2>
                <p>{p.description}</p>
                <p className="mt-2 text-sm text-gray-400">🔑 {p.limit} запросов/день</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Нет данных о планах.</p>
          )}
        </div>
      )}

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-green-300 mb-4">Эндпоинты</h3>
        <ul className="space-y-2 text-gray-400">
          <li>GET /plants — список растений</li>
          <li>POST /generate_key — сгенерировать API-ключ</li>
          <li>GET /health — проверка статуса</li>
        </ul>
      </div>
    </div>
  );
}
