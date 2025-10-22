import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // experimental.appDir убран — в Next 15 он включён по умолчанию
  // дополнительных флагов не требуется
};

export default nextConfig;
