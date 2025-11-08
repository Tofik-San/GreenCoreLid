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
    <div className="relative inline-block bg-black/60 border border-green-500/40 rounded-lg px-5 py-4 text-green-200 font-mono text-sm shadow-[0_0_20px_rgba(83,255,148,0.25)] max-w-full">
      <pre className="whitespace-pre-wrap break-all pr-16 text-center m-0">{code}</pre>

      <button
        onClick={handleCopy}
        className="absolute top-2 right-3 text-green-200 bg-green-900/50 border border-green-400/40 rounded-md px-3 py-1 text-xs hover:bg-green-800 hover:text-green-100 transition-all duration-150"
        style={{ boxShadow: "0 0 8px rgba(83,255,148,0.4)" }}
      >
        {copied ? "✓" : "Копировать"}
      </button>
    </div>
  );
}
