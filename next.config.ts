import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exemplo.com", // troque pelo domínio real das suas imagens
      },
      {
        protocol: "https",
        hostname: "vsszwqqelbyrnjwyspdo.supabase.co", // se usar Supabase Storage
      },
    ],
  },
};

export default nextConfig;