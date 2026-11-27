import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'res.cloudinary.com',
        protocol: 'https',
      },
      {
        hostname: 'api.dicebear.com',
        protocol: 'https',
      },
    ],
  },
  output: process.env.VERCEL ? undefined : 'standalone',
  reactCompiler: true,
};

export default nextConfig;
