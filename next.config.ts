import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Para GitHub Pages - exporta como sitio estático
  output: 'export',
  
  // Optimización de imágenes para estático
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  
  // Permitir imágenes de Supabase
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
