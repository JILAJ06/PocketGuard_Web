import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Optimizar para producción
  poweredByHeader: false,
  compress: true,
  
  // Configuración de imágenes
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
