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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

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
    <main className="min-h-screen px-8 py-12 text-green-100 bg-[var(--gc-bg)] flex flex-col items-center">
      {/* === Встроенный блок API-ключа с кнопками === */}
      <div className="relative mb-10" style={{ maxWidth: "900px", width: "100%" }}>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Введите или вставьте API-ключ"
          className="w-full bg-transparent border border-green-500/40 rounded-xl text-green-100 placeholder-green-700/70 font-mono text-[15px] pr-[230px] pl-4 h-[52px] outline-none shadow-[0_0_14px_rgba(83,255,148,0.2)]"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={pasteKey}
            className="px-4 h-[38px] rounded-md border border-green-400/40 text-green-100 hover:bg-green-500/20 transition"
          >
            Вставить
          </button>
          <button
            onClick={saveKey}
            className="px-5 h-[38px] rounded-md text-[#04140a] font-semibold hover:brightness-110 transition"
            style={{
              background:
                "linear-gradient(90deg, rgba(63,214,124,1) 0%, rgba(83,255,148,1) 100%)",
              boxShadow:
                "0 0 10px rgba(83,255,148,0.3), inset 0 -2px 6px rgba(0,0,0,0.25)",
            }}
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

      {/* === Стили панели === */}
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

      {!loading && plants.length === 0 && (
        <p className="text-green-300 text-center mt-8">Нет результатов</p>
      )}
    </main>
  );
}
