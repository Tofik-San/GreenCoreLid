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
    <div className="relative inline-block w-full max-w-full border border-green-500/50 rounded-xl px-6 py-4 text-green-200 font-mono text-sm bg-[rgba(0,0,0,0.6)] shadow-[0_0_15px_rgba(83,255,148,0.25)] overflow-visible text-left">
      <pre className="whitespace-pre-wrap break-all m-0 pr-16 text-center">{code}</pre>

      <button
        onClick={handleCopy}
        className="absolute top-1.5 right-2 bg-[rgba(0,0,0,0.85)] text-green-300 border border-green-400/50 rounded-md px-3 py-[2px] text-xs hover:bg-green-800 hover:text-white transition-all duration-150 z-[9999]"
        style={{
          boxShadow: "0 0 8px rgba(83,255,148,0.5)",
          backdropFilter: "blur(4px)",
        }}
      >
        {copied ? "✓" : "Копировать"}
      </button>
    </div>
  );
}
