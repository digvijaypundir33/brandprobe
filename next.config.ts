import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@sparticuz/chromium', 'playwright-core'],
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': [
        './node_modules/@sparticuz/chromium/**/*',
      ],
    },
  },
};

export default nextConfig;
