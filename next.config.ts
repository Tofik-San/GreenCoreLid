import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://web-production-310c7c7.up.railway.app/:path*", // прокси к API
      },
    ];
  },
};

export default nextConfig;
