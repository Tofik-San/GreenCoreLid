"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ❌ не показываем на главной и на мобильных
  if (pathname === "/" || isMobile) return null;

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
        top: "4.3rem",
        left: "4.5rem",
        background: "linear-gradient(90deg,#3fd67c,#53ff94)",
        color: "#04140a",
        letterSpacing: "0.4px",
      }}
    >
      ← Назад
    </button>
  );
}
