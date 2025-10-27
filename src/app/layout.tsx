import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GreenCore",
  description: "GreenCore API — цифровое ядро растительного мира.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="relative min-h-screen text-[var(--gc-text)] bg-[var(--gc-bg)] antialiased">
        {children}
      </body>
    </html>
  );
}
