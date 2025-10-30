"use client";
import { useState } from "react";

export default function SearchPage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://web-production-310c7c.up.railway.app";

  const [filters, setFilters] = useState({
    view: "",
    light: "",
    temperature: "",
    toxicity: "",
    beginner_friendly: "",
    placement: "",
  });
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchPlants = async () => {
    setLoading(true);
    setError("");
    try {
      const params = Object.entries(filters)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");

      const res = await fetch(`${API_URL}/plants?${params}`);
      if (!res.ok) throw new Error("Ошибка при запросе к API");

      const data = await res.json();
      setPlants(data.plants || []);
    } catch (err: any) {
      setError(err.message || "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-8 py-16 text-green-100 bg-[var(--gc-bg)]">
      <h1 className="text-4xl text-green-400 mb-10 text-center drop-shadow-[0_0_8px_rgba(83,255,148,0.6)]">
        Поиск растений
      </h1>

      {/* Форма фильтров */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <select name="view" value={filters.view} onChange={handleChange} className="gc-filter">
          <option value="">Вид</option>
          <option value="hydrangea">Hydrangea</option>
          <option value="rosa">Rosa</option>
          <option value="thuja">Thuja</option>
        </select>

        <select name="light" value={filters.light} onChange={handleChange} className="gc-filter">
          <option value="">Освещение</option>
          <option value="shade">Тень</option>
          <option value="partial">Полутень</option>
          <option value="bright">Солнечно</option>
        </select>

        <select name="temperature" value={filters.temperature} onChange={handleChange} className="gc-filter">
          <option value="">Температура</option>
          <option value="cold">Холодостойкие</option>
          <option value="moderate">Умеренные</option>
          <option value="warm">Теплолюбивые</option>
        </select>

        <select name="toxicity" value={filters.toxicity} onChange={handleChange} className="gc-filter">
          <option value="">Токсичность</option>
          <option value="none">Безвредные</option>
          <option value="mild">Слабая</option>
          <option value="toxic">Ядовитые</option>
        </select>

        <select
          name="beginner_friendly"
          value={filters.beginner_friendly}
          onChange={handleChange}
          className="gc-filter"
        >
          <option value="">Для новичков</option>
          <option value="true">Да</option>
          <option value="false">Нет</option>
        </select>

        <button
          onClick={fetchPlants}
          disabled={loading}
          className="gc-btn text-sm px-6 py-3 mt-2"
        >
          {loading ? "Загрузка..." : "Найти"}
        </button>
      </div>

      {/* Ошибка */}
      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      {/* Результаты */}
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {plants.map((p, i) => (
            <div
              key={i}
              className="bg-black/40 border border-green-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(83,255,148,0.3)] hover:shadow-[0_0_40px_rgba(83,255,148,0.45)] transition"
            >
              <h2 className="text-2xl text-green-300 font-bold mb-3">{p.cultivar}</h2>
              <p className="text-green-200 text-sm mb-3">{p.view}</p>
              <p className="text-green-100 text-sm leading-relaxed mb-4 line-clamp-6">
                {p.insights}
              </p>
              <div className="text-xs text-green-400">
                <p>💧 {p.watering}</p>
                <p>☀️ {p.light}</p>
                <p>🌡 {p.temperature}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-green-300 text-center mt-8">Нет результатов</p>
      )}
    </main>
  );
}
