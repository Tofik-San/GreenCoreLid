"use client";

export default function Footer() {
  return (
    <footer className="relative z-[9999] w-full py-10 text-center text-sm text-green-400 border-t border-green-800/50 bg-transparent">
      <p className="mb-2">
        © {new Date().getFullYear()}{" "}
        <span className="text-green-300 font-medium">GreenCore</span> — цифровая ботаника нового уровня.
      </p>
      <p className="text-green-700/70 text-xs select-none">
        Все права защищены.
      </p>
    </footer>
  );
}
