"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className="
        fixed
        z-[9999]
        gc-btn
        px-6
        py-3
        text-sm
        font-semibold
        rounded-full
        shadow-[0_0_18px_rgba(83,255,148,0.45)]
        hover:translate-y-[-1px]
        transition-all
      "
      style={{
        top: "4.5rem",     // ⬇ ниже
        left: "4.5rem",    // ➡ правее
        background: "linear-gradient(90deg,#3fd67c,#53ff94)",
        color: "#04140a",
        letterSpacing: "0.4px",
      }}
    >
      ← Назад
    </button>
  );
}
