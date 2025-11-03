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
    sort: "random",
  });
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [requestUrl, setRequestUrl] = useState("");

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
        method: "GET",
        headers: {
          "X-API-Key": apiKey.trim(),
          "Content-Type": "application/json",
        },
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

      {/* === API-ключ === */}
      <div className="api-key-panel">
        <div className="api-key-row">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Введите API-ключ"
            className="api-key-input"
          />
          <button onClick={saveKey} className="api-key-button">
            Применить
          </button>
        </div>
        {saved && <span className="api-key-saved">✓ Ключ принят</span>}
      </div>

      {/* === Панель фильтров === */}
      <div className="filter-panel">
        <div className="filter-item">
          <label htmlFor="view">Вид / сорт</label>
          <input
            id="view"
            name="view"
            type="text"
            value={filters.view}
            onChange={(e) =>
              setFilters({ ...filters, view: e.target.value })
            }
            placeholder="Например: hydrangea"
          />
        </div>

        <div className="filter-item">
          <label htmlFor="light">Освещение</label>
          <select
            id="light"
            name="light"
            value={filters.light}
            onChange={handleChange}
          >
            <option value="">--</option>
            <option value="тень">тень</option>
            <option value="полутень">полутень</option>
            <option value="яркий">яркий</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="zone_usda">Зона USDA</label>
          <select
            id="zone_usda"
            name="zone_usda"
            value={filters.zone_usda}
            onChange={handleChange}
          >
            <option value="">--</option>
            {Array.from({ length: 11 }, (_, i) => (
              <option key={i + 2} value={(i + 2).toString()}>
                {i + 2}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="toxicity">Токсичность</label>
          <select
            id="toxicity"
            name="toxicity"
            value={filters.toxicity}
            onChange={handleChange}
          >
            <option value="">--</option>
            <option value="none">none</option>
            <option value="mild">mild</option>
            <option value="toxic">toxic</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="placement">Размещение</label>
          <select
            id="placement"
            name="placement"
            value={filters.placement}
            onChange={handleChange}
          >
            <option value="">--</option>
            <option value="комнатное">комнатное</option>
            <option value="садовое">садовое</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="sort">Сортировка</label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={(e) =>
              setFilters({ ...filters, sort: e.target.value })
            }
          >
            <option value="random">random</option>
            <option value="id">id</option>
          </select>
        </div>

        <button onClick={fetchPlants} disabled={loading}>
          {loading ? "Загрузка..." : "Найти"}
        </button>
      </div>

      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      {/* === Карточки === */}
      <div className="max-w-[1100px] mx-auto mt-10">
        {plants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plants.map((p, i) => (
              <article
                key={i}
                className="bg-black/50 border border-green-500/30 rounded-xl shadow-md p-6 flex flex-col gap-3 hover:border-green-400/40 transition"
              >
                <div>
                  <h2 className="text-2xl text-green-300 font-bold">
                    {p.cultivar}
                  </h2>
                  <p className="text-green-200 italic">{p.view}</p>
                  <p className="text-green-400 text-sm">{p.family}</p>
                </div>

                <hr className="border-green-900/50 my-2" />

                {p.insights && (
                  <p className="text-green-100 text-sm leading-relaxed">
                    {p.insights}
                  </p>
                )}

                <div className="space-y-1 text-xs text-green-300 mt-2">
                  {p.light && <p>☀ <b>Свет:</b> {p.light}</p>}
                  {p.watering && <p>💧 <b>Полив:</b> {p.watering}</p>}
                  {p.temperature && <p>🌡 <b>Температура:</b> {p.temperature}</p>}
                  {p.soil && <p>🌱 <b>Почва:</b> {p.soil}</p>}
                  {p.fertilizer && <p>🧪 <b>Удобрения:</b> {p.fertilizer}</p>}
                </div>

                {(p.pruning || p.pests_diseases) && (
                  <div className="space-y-1 text-xs text-green-400 mt-2">
                    {p.pruning && <p>✂ <b>Обрезка:</b> {p.pruning}</p>}
                    {p.pests_diseases && (
                      <p>🦠 <b>Вредители и болезни:</b> {p.pests_diseases}</p>
                    )}
                  </div>
                )}

                <div className="space-y-1 text-xs text-green-500 mt-2">
                  <p>
                    🏡 <b>Размещение:</b>{" "}
                    {p.indoor ? "комнатное" : p.outdoor ? "садовое" : "—"}
                  </p>
                  <p>
                    🌿 <b>Для начинающих:</b>{" "}
                    {p.beginner_friendly ? "подходит" : "требует опыта"}
                  </p>
                  <p>⚠ <b>Токсичность:</b> {p.toxicity || "none"}</p>
                  {p.ru_regions && <p>📍 <b>Регионы РФ:</b> {p.ru_regions}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-green-300 text-center mt-8">Нет результатов</p>
          )
        )}
      </div>
    </main>
  );
}
