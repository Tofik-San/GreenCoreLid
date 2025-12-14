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
    category: "",
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
  
  const TOXICITY_LABELS: Record<string, string> = {
    none: "нет",
    mild: "умеренная",
    toxic: "токсично",
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
            <option value="none">Нет</option>
            <option value="mild">Умеренная</option>
            <option value="toxic">Токсично</option>
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
           <label htmlFor="category">Категория</label>
           <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
        >
            <option value="">--</option>
            <option value="annual">Однолетники</option>
            <option value="perennial">Многолетники</option>
            <option value="indoor">Комнатные</option>
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

      {/* === Стили фильтров и панели === */}
      <style jsx>{`
        .api-key-panel {
          max-width: 900px;
          margin: 40px auto 40px;
        }
        .api-key-row {
          display: flex;
          gap: 12px;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }
        .api-key-input {
          flex: 1 1 auto;
          height: 48px;
          border: 1px solid rgba(83, 255, 148, 0.4);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.5);
          color: #c6f7cb;
          font-size: 15px;
          padding: 0 16px;
          outline: none;
        }
        .api-key-input:focus {
          border-color: #53ff94;
        }
        .api-key-button {
          all: unset;
          height: 48px;
          min-width: 110px;
          padding: 0 20px;
          background: #43e37c;
          color: #0b1a0f;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.12s ease;
        }
        .api-key-button:hover {
          background: #53ff94;
        }
        .api-key-saved {
          display: block;
          color: #53ff94;
          margin-top: 8px;
          font-size: 14px;
          text-align: center;
        }
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

      {/* === Вывод карточек === */}
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
  <div className="text-green-100 text-sm leading-relaxed space-y-1">
    {p.insights.split("►").map((line: string, i: number) =>
      line.trim() && <p key={i}>► {line.trim()}</p>
    )}
  </div>
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
                <p>
                  ⚠ <b>Токсичность:</b>{" "}
                  {TOXICITY_LABELS[p.toxicity] || "—"}
                </p>

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
