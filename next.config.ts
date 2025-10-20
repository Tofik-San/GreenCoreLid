import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // чтобы не ронял билд при lint-ошибках
  },
  typescript: {
    ignoreBuildErrors: true, // чтобы не падал билд из-за TS-варнингов
  },
  images: {
    domains: ["images.unsplash.com", "cdn.pixabay.com"], // можно добавить свои домены для картинок
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://web-production-310c7c.up.railway.app",
  },
};

export default nextConfig;
