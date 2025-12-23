import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack due to Windows symlink permission issues
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
