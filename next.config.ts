import type { NextConfig } from "next";
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Self-contained production server: bundles only the files actually used into
  // .next/standalone, so deploys are small and run with low RAM — ideal for a
  // cheap DigitalOcean droplet. No effect on local dev.
  output: 'standalone',
  turbopack: {
    resolveAlias: {
      'next/dist/build/polyfills/polyfill-module': './src/polyfills-modern.js',
    },
  },
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
          // XSS protection via CSP — unsafe-inline required for Next.js hydration without nonces
          { key: 'Content-Security-Policy', value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://accounts.google.com https://www.clarity.ms https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data:",
            "connect-src 'self' ws: wss: https:",
            "media-src 'self' blob: https:",
            "object-src 'none'",
            "frame-src 'self' https://accounts.google.com https://challenges.cloudflare.com",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self' https://accounts.google.com",
            "upgrade-insecure-requests",
          ].join('; ') },
          // Cross-origin opener isolation — allows OAuth popups (Google) to work
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
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
  // Slim down Next.js's built-in polyfill bundle.
  // The default polyfill-module guards Array.at, Object.hasOwn, Object.fromEntries,
  // flat/flatMap, trimStart/trimEnd, Promise.finally — all Baseline 2021 features
  // supported natively since late 2021. Our replacement keeps only URL.canParse
  // (Chrome 120+, Dec 2023) which Next.js routing depends on.
  //
  // Works for webpack builds. Turbopack (current default) injects polyfill-module as
  // a hardcoded entry point that bypasses resolveAlias — the ~1.4 KB guarded
  // polyfill code is unavoidable there until Next.js exposes a public override.
  webpack(config) {
    config.resolve.alias['next/dist/build/polyfills/polyfill-module'] =
      path.resolve(__dirname, 'src/polyfills-modern.js');
    return config;
  },
  // Reduce unused JavaScript sent to client
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns', 'd3-geo'],
    optimizeCss: !isDev,
  },
};

export default withNextIntl(nextConfig);
