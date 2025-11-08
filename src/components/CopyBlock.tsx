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
    <div className="flex items-center justify-between border border-green-500/50 rounded-xl px-5 py-3 text-green-200 font-mono text-sm bg-[rgba(0,0,0,0.6)] shadow-[0_0_15px_rgba(83,255,148,0.25)] max-w-full">
      <span className="break-all select-text">{code}</span>

      <button
        onClick={handleCopy}
        className="ml-4 whitespace-nowrap bg-green-900/70 text-green-100 border border-green-400/40 rounded-md px-3 py-1 text-xs hover:bg-green-700 hover:text-white transition-all duration-150 shadow-[0_0_6px_rgba(83,255,148,0.4)]"
        style={{ backdropFilter: "blur(4px)" }}
      >
        {copied ? "✓" : "Копировать"}
      </button>
    </div>
  );
}
