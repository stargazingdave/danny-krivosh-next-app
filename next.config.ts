import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stoemntmqzipqakiochh.supabase.co', // ← your Supabase domain
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // or higher if you want
    },
  },
};

export default nextConfig;
