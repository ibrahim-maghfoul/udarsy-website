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
        // Security headers — applied to every route
        source: '/:path*',
        headers: [
          // Clickjacking protection
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // MIME-type sniffing protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable sensitive browser APIs
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // HSTS — force HTTPS for 1 year (Cloudflare also enforces this)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
      {
        // Static assets: aggressive caching (fonts, icons, images)
        source: '/:path*.(woff2|woff|ttf|ico|png|jpg|jpeg|svg|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // JS/CSS chunks: long cache (content-hashed filenames guarantee freshness)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Public landing + browse pages: Cloudflare edge cache 1 h, browser 5 min
        // s-maxage is read by Cloudflare; max-age is the browser fallback
        source: '/(|ar|fr|en)(|/courses|/news|/contact|/teacher|/calendar|/contributions)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=300, max-age=300' },
        ],
      },
      {
        // API routes proxied through Next.js — never cache at the edge
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
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
