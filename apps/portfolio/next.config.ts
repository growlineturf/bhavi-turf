import type { NextConfig } from "next";

const allowedDevOrigins = Array.from(
  new Set([
    ...(process.env.NEXT_ALLOWED_DEV_ORIGINS
      ? process.env.NEXT_ALLOWED_DEV_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
      : []),
    // Allow same-Wi-Fi phones/tablets to hit the dev server (HMR + assets).
    '172.20.10.3',   // ← your current hotspot/WiFi IP
    '192.168.18.149',
    '192.168.1.1',
  ]),
);

const nextConfig: NextConfig = {
  allowedDevOrigins,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'vercel.com' },
    ],
  },
};

export default nextConfig;
