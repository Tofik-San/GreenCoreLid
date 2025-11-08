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
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const pasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setApiKey(text.trim());
    } catch {
      alert("Не удалось вставить ключ из буфера обмена");
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

      const res = await fetch(`${API_URL}/plants?${params}`, {
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
    <main className="min-h-screen px-6 pt-8 text-green-100 bg-[var(--gc-bg)] flex flex-col items-center">
      {/* === API-ключ === */}
      <div
        className="flex items-center justify-between gap-3 mb-8 px-5 py-3 rounded-xl border border-green-500/30 bg-black/30 shadow-[0_0_14px_rgba(83,255,148,0.15)]"
        style={{ maxWidth: "900px", width: "100%", height: "58px" }}
      >
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Введите или вставьте API-ключ"
          className="flex-grow bg-transparent border-none outline-none text-green-100 placeholder-green-700/70 font-mono text-[15px]"
          style={{ height: "100%", paddingLeft: "10px", paddingRight: "10px" }}
        />
        <div className="flex items-center gap-2 h-full">
          <button
            onClick={pasteKey}
            className="px-4 h-full rounded-md border border-green-400/40 text-green-200 hover:bg-green-500/20 transition flex items-center justify-center"
            style={{ minWidth: "100px" }}
          >
            Вставить
          </button>
          <button
            onClick={saveKey}
            className="px-5 h-full rounded-md bg-[linear-gradient(90deg,#3fd67c,#53ff94)] text-[#04140a] font-semibold hover:brightness-110 transition flex items-center justify-center"
            style={{ minWidth: "110px" }}
          >
            Применить
          </button>
        </div>
      </div>

      {saved && (
        <p className="text-green-400 text-center mb-8">✓ Ключ принят</p>
      )}

      {/* === Панель фильтров === */}
      <div className="filter-panel">
        <div className="filter-item">
          <label htmlFor="view">Вид / сорт</label>
          <input
            id="view"
            name="view"
            type="text"
            value={filters.view}
            onChange={(e) => setFilters({ ...filters, view: e.target.value })}
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
            onChange={handleChange}
          >
            <option value="random">random</option>
            <option value="id">id</option>
          </select>
        </div>

        <button onClick={fetchPlants} disabled={loading}>
          {loading ? "Загрузка..." : "Найти"}
        </button>
      </div>

      {/* === Стили === */}
      <style jsx>{`
        .filter-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          max-width: 900px;
          margin: 0 auto 50px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(83, 255, 148, 0.2);
          border-radius: 8px;
          padding: 24px 28px;
        }
        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
          color: #bde6c2;
        }
        label {
          font-weight: 500;
          color: #8effa9;
        }
        input,
        select {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(83, 255, 148, 0.3);
          border-radius: 6px;
          padding: 8px 10px;
          color: #c6f7cb;
          font-size: 14px;
          outline: none;
        }
        select option {
          color: #000;
          background: #e8ffe8;
        }
        input:focus,
        select:focus {
          border-color: #53ff94;
        }
        button {
          grid-column: 1 / -1;
          margin-top: 10px;
          padding: 10px 0;
          background: #43e37c;
          color: #0b1a0f;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        button:hover {
          background: #53ff94;
        }
      `}</style>

      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {plants.map((p, i) => (
            <div
              key={i}
              className="bg-black/40 border border-green-500/30 rounded-lg p-6 flex flex-col gap-3"
            >
              <div>
                <h2 className="text-2xl text-green-300 font-bold">{p.cultivar}</h2>
                {p.view && <p className="text-green-200 italic">{p.view}</p>}
                {p.family && <p className="text-green-400 text-sm">{p.family}</p>}
              </div>

              {p.insights && (
                <p className="text-green-100 text-sm leading-relaxed">{p.insights}</p>
              )}

              <div className="text-xs text-green-300 space-y-1 mt-2">
                {p.light && <p>☀ <b>Свет:</b> {p.light}</p>}
                {p.watering && <p>💧 <b>Полив:</b> {p.watering}</p>}
                {p.temperature && <p>🌡 <b>Температура:</b> {p.temperature}</p>}
                {p.soil && <p>🌱 <b>Почва:</b> {p.soil}</p>}
                {p.fertilizer && <p>🧪 <b>Удобрения:</b> {p.fertilizer}</p>}
              </div>

              {(p.pruning || p.pests_diseases) && (
                <div className="text-xs text-green-400 mt-2">
                  {p.pruning && <p>✂ <b>Обрезка:</b> {p.pruning}</p>}
                  {p.pests_diseases && (
                    <p>🦠 <b>Вредители и болезни:</b> {p.pests_diseases}</p>
                  )}
                </div>
              )}

              <div className="text-xs text-green-500 mt-2 space-y-1">
                <p>
                  🏡 <b>Размещение:</b>{" "}
                  {p.indoor ? "комнатное" : p.outdoor ? "садовое" : "—"}
                </p>
                <p>
                  🌿 <b>Для начинающих:</b>{" "}
                  {p.beginner_friendly ? "подходит" : "требует опыта"}
                </p>
                <p>⚠ <b>Токсичность:</b> {p.toxicity || "none"}</p>
                {p.ru_regions && (
                  <p>📍 <b>Регионы РФ:</b> {p.ru_regions}</p>
                )}
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
