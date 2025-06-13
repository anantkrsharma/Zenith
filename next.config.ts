import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me'
      }
    ]
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    '192.168.29.206',
    '192.168.1.72',
    '192.168.1.35',
    '192.168.1.39'
  ]
};

export default nextConfig;
