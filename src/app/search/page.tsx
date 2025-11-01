"use client";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://web-production-310c7c.up.railway.app";

  const [apiKey, setApiKey] = useState("");
  const [filters, setFilters] = useState({
    view: "",
    light: "",
    zone_usda: "",
    toxicity: "",
    placement: "",
  });
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [requestUrl, setRequestUrl] = useState(""); // лог запроса

  // Загрузка ключа из localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("api_key");
      if (savedKey) setApiKey(savedKey);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const saveKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("api_key", apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const fetchPlants = async () => {
    if (!apiKey) {
      setError("Введите API-ключ перед поиском.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const params = Object.entries(filters)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

      const fullUrl = `${API_URL}/plants?${params}`;
      setRequestUrl(fullUrl);

      const res = await fetch(fullUrl, {
        headers: { "X-API-Key": apiKey },
      });

      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      setPlants(data.results || []);
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

      {/* Поле для API-ключа */}
      <div className="flex justify-center items-center gap-4 mb-10">
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Введите API-ключ"
          className="w-[320px] px-4 py-2 rounded-xl bg-black/40 border border-green-400/40 text-green-200 placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button onClick={saveKey} className="gc-btn text-sm px-6 py-2">
          Сохранить
        </button>
        {saved && (
          <span className="text-green-400 text-sm animate-pulse">
            ✓ Ключ сохранён
          </span>
        )}
      </div>

      {/* Форма фильтров */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {/* Вид */}
        <select
          name="view"
          value={filters.view}
          onChange={handleChange}
          className="gc-filter"
        >
          <option value="">Вид</option>
          <option value="hydrangea">Hydrangea</option>
          <option value="rosa">Rosa</option>
          <option value="thuja">Thuja</option>
          <option value="acer">Acer</option>
        </select>

        {/* Освещение */}
        <select
          name="light"
          value={filters.light}
          onChange={handleChange}
          className="gc-filter"
        >
          <option value="">Освещение</option>
          <option value="тень">Тень</option>
          <option value="полутень">Полутень</option>
          <option value="яркий">Яркий свет</option>
        </select>

        {/* Зона USDA */}
        <select
          name="zone_usda"
          value={filters.zone_usda}
          onChange={handleChange}
          className="gc-filter"
        >
          <option value="">Зона USDA</option>
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i + 2} value={(i + 2).toString()}>
              {i + 2}
            </option>
          ))}
        </select>

        {/* Токсичность */}
        <select
          name="toxicity"
          value={filters.toxicity}
          onChange={handleChange}
          className="gc-filter"
        >
          <option value="">Токсичность</option>
          <option value="none">Безвредные</option>
          <option value="mild">Слабая</option>
          <option value="toxic">Ядовитые</option>
        </select>

        {/* Размещение */}
        <select
          name="placement"
          value={filters.placement}
          onChange={handleChange}
          className="gc-filter"
        >
          <option value="">Размещение</option>
          <option value="комнатное">Комнатное</option>
          <option value="садовое">Садовое</option>
        </select>

        {/* Кнопка поиска */}
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

      {/* Лог запроса */}
      {requestUrl && (
        <p className="text-xs text-green-400 text-center mb-6 break-all">
          🔗 <strong>Запрос:</strong> {requestUrl}
        </p>
      )}

      {/* Результаты */}
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {plants.map((p, i) => (
            <div
              key={i}
              className="bg-black/40 border border-green-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(83,255,148,0.3)] hover:shadow-[0_0_40px_rgba(83,255,148,0.45)] transition"
            >
              <h2 className="text-2xl text-green-300 font-bold mb-3">
                {p.cultivar}
              </h2>
              <p className="text-green-200 text-sm mb-3">{p.view}</p>
              <p className="text-green-100 text-sm leading-relaxed mb-4 line-clamp-6">
                {p.insights}
              </p>
              <div className="text-xs text-green-400 space-y-1">
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
