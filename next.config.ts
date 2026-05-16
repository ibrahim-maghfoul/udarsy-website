import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // News articles can come from any external source (scraped Moroccan edu/news sites)
      { protocol: "https", hostname: "**" },
      // Backend (local dev)
      ...(isDev ? [{ protocol: "http" as const, hostname: "localhost" }] : []),
    ],
    localPatterns: [
      { pathname: "/**" },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  async redirects() {
    return [
      { source: '/explore', destination: '/courses', permanent: true },
      { source: '/explore/subject/:path*', destination: '/courses/subject/:path*', permanent: true },
    ];
  },
  async headers() {
    if (isDev) {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' },
            { key: 'Pragma', value: 'no-cache' },
            { key: 'Expires', value: '0' },
          ],
        },
      ];
    }
    return [
      {
        // Static assets: aggressive caching (fonts, icons, images)
        source: '/:path*.(woff2|woff|ttf|ico|png|jpg|jpeg|svg|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // JS/CSS chunks: long cache with revalidation (content-hashed filenames)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  compress: true,
  // Reduce unused JavaScript sent to client
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns', 'd3-geo'],
  },
};

export default withNextIntl(nextConfig);
