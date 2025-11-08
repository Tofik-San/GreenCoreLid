"use client";
import { useState } from "react";

export default function CopyBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
    }
  };

  return (
    <div
      className="relative w-full bg-black/60 border border-green-500/40 rounded-xl p-4 text-green-200 font-mono text-sm shadow-[0_0_20px_rgba(83,255,148,0.25)] max-w-full overflow-hidden text-left"
      style={{ display: "inline-block" }}
    >
      <pre className="whitespace-pre-wrap break-all pr-20 m-0">{code}</pre>

      <button
        onClick={handleCopy}
        className="absolute top-2 right-3 z-10 text-green-100 bg-green-900/60 border border-green-400/40 rounded-md px-3 py-1 text-xs font-semibold hover:bg-green-800 hover:text-white transition-all duration-150"
        style={{
          boxShadow: "0 0 8px rgba(83,255,148,0.4)",
          backdropFilter: "blur(6px)",
        }}
      >
        {copied ? "✓" : "Копировать"}
      </button>
    </div>
  );
}
