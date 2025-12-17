"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // ❌ на главной не показываем
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className="
        fixed
        top-6
        left-6
        z-[9999]
        px-4
        py-2
        rounded-full
        text-sm
        font-medium
        text-green-200
        border
        border-green-500/40
        bg-black/60
        backdrop-blur-md
        shadow-[0_0_12px_rgba(83,255,148,0.35)]
        hover:bg-green-700/30
        hover:text-green-100
        transition-all
      "
    >
      ← Назад
    </button>
  );
}
