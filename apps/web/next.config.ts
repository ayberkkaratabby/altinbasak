import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['framer-motion'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Dev-only: Rewrite /admin to admin app running on port 3001
  // PRODUCTION-SAFE: Only applies in development, returns [] in production
  async rewrites() {
    // Explicitly check for development mode
    // In production builds, NODE_ENV will be 'production' and this returns []
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }
    
    // Only in development: proxy /admin/* to admin app
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:3001/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
