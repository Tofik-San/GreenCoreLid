"use client";
import { useState } from "react";
import { FaLeaf, FaDollarSign, FaEnvelope } from "react-icons/fa";

export default function Header() {
  const [active, setActive] = useState<string | null>(null);

  const navItems = [
    { id: "features", label: "Возможности", icon: <FaLeaf /> },
    { id: "pricing", label: "Тарифы", icon: <FaDollarSign /> },
    { id: "contact", label: "Контакты", icon: <FaEnvelope /> },
  ];

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center py-4 pl-6 pr-16 sm:pl-8 sm:pr-20 z-50 bg-transparent backdrop-blur-sm">
      {/* ЛОГОТИП */}
      <div className="text-[32px] sm:text-[36px] md:text-[40px] font-extrabold tracking-wider text-green-400 drop-shadow-[0_0_12px_#00ff88] select-none cursor-default whitespace-nowrap">
        GreenCore
      </div>

      {/* НАВИГАЦИЯ */}
      <nav className="flex items-center gap-5 sm:gap-8 md:gap-10">
        {navItems.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setActive(item.id)}
            onMouseLeave={() => setActive(null)}
            className="relative flex flex-col items-center text-green-400 hover:text-green-300 transition duration-300"
          >
            <a
              href={`#${item.id}`}
              className="text-lg sm:text-xl md:text-2xl drop-shadow-[0_0_8px_#00ff88]"
            >
              {item.icon}
            </a>
            <span
              className={`absolute top-7 sm:top-8 text-[10px] sm:text-xs font-light tracking-widest transition duration-300 ${
                active === item.id ? "opacity-100" : "opacity-0"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </header>
  );
}
