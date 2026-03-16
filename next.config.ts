import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@sparticuz/chromium', 'playwright-core'],
  outputFileTracingIncludes: {
    '/api/**': [
      './node_modules/@sparticuz/chromium/**/*',
    ],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mcsdmpejxwbyxxuhraap.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54331',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
