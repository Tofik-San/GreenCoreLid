import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    // чтобы модалки, createPortal и document работали на клиенте
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;
