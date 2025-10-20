/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Основной URL для запросов к API
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // Альтернативное имя для совместимости (если используется в коде)
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
