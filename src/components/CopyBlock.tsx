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
    <div className="relative group bg-black/40 border border-green-600/30 rounded-lg p-4 text-green-200 font-mono text-sm leading-relaxed">
      <pre className="whitespace-pre-wrap break-words">{code}</pre>

      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-green-300 bg-green-900/40 rounded-md px-2 py-1 text-xs hover:bg-green-800 transition"
      >
        {copied ? "✓ Скопировано" : "Копировать"}
      </button>
    </div>
  );
}
