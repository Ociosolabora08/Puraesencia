import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // M1/M2 reactivados: strict mode + errores de TS rompen el build (no se enmascaran)
  reactStrictMode: true,
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      // Vercel Blob (los uploads viven aquí en producción)
      { protocol: "https", hostname: "pb.datalbpgexbtyzrfgndqg.supabase.co" },
      // Imágenes de categorías/logo del seed
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
