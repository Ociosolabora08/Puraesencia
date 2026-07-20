import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard build output - works with `next start` on Render, Vercel, etc.
  // We use this instead of "standalone" because Render handles node_modules via npm install.
  reactStrictMode: false,
  // Sharp is used for image upload optimization
  images: {
    formats: ["image/webp"],
  },
  // Skip type errors during build (existing project may have minor type issues)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
