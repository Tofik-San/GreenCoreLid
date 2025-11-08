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
      className="relative w-full border border-green-500/50 rounded-xl px-6 py-5 text-green-200 font-mono text-sm bg-[rgba(0,0,0,0.7)] shadow-[0_0_15px_rgba(83,255,148,0.25)] text-left"
      style={{ display: "block" }}
    >
      <pre className="whitespace-pre-wrap break-all m-0 pr-20">{code}</pre>

      <div className="absolute top-2 right-3">
        <button
          onClick={handleCopy}
          className="bg-green-900/70 text-green-200 border border-green-400/50 rounded-md px-3 py-1 text-xs font-semibold hover:bg-green-700 hover:text-white transition-all duration-150 shadow-[0_0_6px_rgba(83,255,148,0.4)]"
          style={{ backdropFilter: "blur(4px)" }}
        >
          {copied ? "✓ Скопировано" : "Копировать"}
        </button>
      </div>
    </div>
  );
}
