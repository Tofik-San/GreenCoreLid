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

      {/* === Поле API-ключа === */}
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

      {/* === Стили === */}
      <style jsx>{`
        /* === API key block === */
        .api-key-panel {
          max-width: 900px;
          margin: 40px auto 40px;
        }

        .api-key-row {
          display: flex !important;
          gap: 12px;
          width: 100%;
          align-items: center !important;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .api-key-input {
          flex: 1 1 auto;
          height: 48px;
          box-sizing: border-box;
          border: 1px solid rgba(83, 255, 148, 0.4);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.5);
          color: #c6f7cb;
          font-size: 15px;
          padding: 0 16px;
          outline: none;
          display: block;
          line-height: 48px;
        }

        .api-key-input:focus {
          border-color: #53ff94;
        }

        .api-key-button {
          all: unset;
          display: inline-block !important;
          height: 48px !important;
          line-height: 48px !important;
          min-width: 110px;
          padding: 0 20px !important;
          background: #43e37c !important;
          color: #0b1a0f !important;
          border-radius: 8px !important;
          text-align: center;
          font-weight: 600;
          cursor: pointer;
          box-sizing: border-box;
          transition: background 0.12s ease;
          vertical-align: middle;
        }

        .api-key-button:hover {
          background: #53ff94 !important;
        }

        .api-key-saved {
          display: block;
          color: #53ff94;
          margin-top: 8px;
          font-size: 14px;
          text-align: center;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* === Filter panel === */
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
      <div style={{ display: "none" }}>{requestUrl}</div>

      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {plants.map((p, i) => (
            <div
              key={i}
              className="bg-black/40 border border-green-500/30 rounded-lg p-6"
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
        !loading && (
          <p className="text-green-300 text-center mt-8">Нет результатов</p>
        )
      )}
    </main>
  );
}
