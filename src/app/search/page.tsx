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

      {/* === Поле API-ключа (новый стиль) === */}
      <div
        className="relative mb-12 mx-auto"
        style={{
          width: "80vw",
          maxWidth: "1100px",
          minWidth: "720px",
          background:
            "linear-gradient(180deg, rgba(12,20,14,0.85), rgba(18,26,20,0.9))",
          border: "1px solid rgba(83,255,148,0.25)",
          borderRadius: "14px",
          boxShadow: "0 0 20px rgba(83,255,148,0.15)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          overflowX: "auto",
        }}
      >
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Введите или вставьте API-ключ"
          style={{
            flexGrow: 1,
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#9effb5",
            textShadow: "0 0 6px rgba(83,255,148,0.4)",
            background: "transparent",
            border: "none",
            outline: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        />

        <button
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              setApiKey(text.trim());
            } catch {
              alert("Не удалось вставить ключ из буфера");
            }
          }}
          style={{
            marginLeft: "20px",
            padding: "8px 14px",
            borderRadius: "8px",
            background: "rgba(83,255,148,0.15)",
            border: "1px solid rgba(83,255,148,0.3)",
            color: "#aaffc8",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(83,255,148,0.25)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(83,255,148,0.15)")
          }
        >
          Вставить
        </button>

        <button
          onClick={saveKey}
          style={{
            marginLeft: "12px",
            padding: "8px 20px",
            borderRadius: "8px",
            background: "linear-gradient(90deg,#3fd67c,#53ff94)",
            color: "#04140a",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            transition: "filter 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.1)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Применить
        </button>
      </div>

      {saved && (
        <span className="block text-center text-green-400 mt-2">
          ✓ Ключ принят
        </span>
      )}

      {/* === Панель фильтров (адаптированная сетка) === */}
      <div
        className="flex flex-wrap justify-center gap-6 max-w-[1100px] mx-auto mb-12 p-8"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(83,255,148,0.2)",
          borderRadius: "12px",
          boxShadow: "0 0 16px rgba(83,255,148,0.1)",
          minWidth: "760px",
        }}
      >
        {[
          {
            id: "view",
            label: "Вид / сорт",
            type: "text",
            placeholder: "Например: hydrangea",
          },
          {
            id: "light",
            label: "Освещение",
            type: "select",
            options: ["тень", "полутень", "яркий"],
          },
          {
            id: "zone_usda",
            label: "Зона USDA",
            type: "select",
            options: Array.from({ length: 11 }, (_, i) => (i + 2).toString()),
          },
          {
            id: "toxicity",
            label: "Токсичность",
            type: "select",
            options: ["none", "mild", "toxic"],
          },
          {
            id: "placement",
            label: "Размещение",
            type: "select",
            options: ["комнатное", "садовое"],
          },
          {
            id: "sort",
            label: "Сортировка",
            type: "select",
            options: ["random", "id"],
          },
        ].map((f) => (
          <div
            key={f.id}
            className="flex flex-col gap-2 min-w-[220px] flex-grow max-w-[300px]"
          >
            <label
              htmlFor={f.id}
              className="text-green-400 text-sm font-medium"
            >
              {f.label}
            </label>
            {f.type === "text" ? (
              <input
                id={f.id}
                name={f.id}
                type="text"
                value={filters[f.id as keyof typeof filters] || ""}
                onChange={(e) =>
                  setFilters({ ...filters, [f.id]: e.target.value })
                }
                placeholder={f.placeholder}
                className="bg-black/30 border border-green-400/30 rounded-md px-3 py-2 text-green-100 placeholder-green-700/60 focus:outline-none focus:border-green-400"
              />
            ) : (
              <select
                id={f.id}
                name={f.id}
                value={filters[f.id as keyof typeof filters] || ""}
                onChange={handleChange}
                className="bg-black/30 border border-green-400/30 rounded-md px-3 py-2 text-green-100 focus:outline-none focus:border-green-400"
              >
                <option value="">--</option>
                {Array.isArray(f.options) &&
                  f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
            )}
          </div>
        ))}

        <button
          onClick={fetchPlants}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-md bg-[linear-gradient(90deg,#3fd67c,#53ff94)] text-[#04140a] font-semibold hover:brightness-110 transition duration-200 shadow-[0_0_14px_rgba(83,255,148,0.4)]"
        >
          {loading ? "Загрузка..." : "Найти"}
        </button>
      </div>

      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      {/* === Результаты === */}
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {plants.map((p, i) => (
            <div
              key={i}
              className="bg-black/40 border border-green-500/30 rounded-lg p-6 flex flex-col gap-3"
            >
              <div>
                <h2 className="text-2xl text-green-300 font-bold">
                  {p.cultivar}
                </h2>
                {p.view && <p className="text-green-200 italic">{p.view}</p>}
                {p.family && (
                  <p className="text-green-400 text-sm">{p.family}</p>
                )}
              </div>

              {p.insights && (
                <p className="text-green-100 text-sm leading-relaxed">
                  {p.insights}
                </p>
              )}

              <div className="text-xs text-green-300 space-y-1 mt-2">
                {p.light && (
                  <p>
                    ☀ <b>Свет:</b> {p.light}
                  </p>
                )}
                {p.watering && (
                  <p>
                    💧 <b>Полив:</b> {p.watering}
                  </p>
                )}
                {p.temperature && (
                  <p>
                    🌡 <b>Температура:</b> {p.temperature}
                  </p>
                )}
                {p.soil && (
                  <p>
                    🌱 <b>Почва:</b> {p.soil}
                  </p>
                )}
                {p.fertilizer && (
                  <p>
                    🧪 <b>Удобрения:</b> {p.fertilizer}
                  </p>
                )}
              </div>

              {(p.pruning || p.pests_diseases) && (
                <div className="text-xs text-green-400 mt-2">
                  {p.pruning && (
                    <p>
                      ✂ <b>Обрезка:</b> {p.pruning}
                    </p>
                  )}
                  {p.pests_diseases && (
                    <p>
                      🦠 <b>Вредители и болезни:</b> {p.pests_diseases}
                    </p>
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
                  <p>
                    📍 <b>Регионы РФ:</b> {p.ru_regions}
                  </p>
                )}
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
