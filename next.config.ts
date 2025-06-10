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
    'http://192.168.29.206',
    'http://192.168.29.206:3000',
    'http://192.168.29.206:3001',
    '192.168.1.72',
    'http://192.168.1.72',
    'http://192.168.1.72:3000',
    'http://192.168.1.72:3001',
  ]
};

export default nextConfig;
