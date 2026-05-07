'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  trackPageView,
  captureTrafficSource,
  initScrollDepthTracking,
} from '@/lib/analytics';

/**
 * useAnalytics — master hook that wires up all passive tracking:
 *  ✅ Page view on every route change (SPA navigation aware)
 *  ✅ Referral / traffic source capture (once per session)
 *  ✅ Scroll depth milestones (25 / 50 / 75 / 100%)
 *
 * Drop this in layout.tsx or a top-level client component.
 */
export function useAnalytics() {
  const pathname = usePathname();
  const locale   = useLocale();
  const capturedRef = useRef(false);

  // ── Traffic source capture (once per session) ──────────────────────────────
  useEffect(() => {
    if (capturedRef.current) return;
    capturedRef.current = true;
    captureTrafficSource();
  }, []);

  // ── Page view on every route change ───────────────────────────────────────
  useEffect(() => {
    if (!pathname) return;
    trackPageView({
      path: pathname,
      locale,
      title: document.title,
      referrer: document.referrer,
    });
  }, [pathname, locale]);

  // ── Scroll depth (reset on each page) ─────────────────────────────────────
  useEffect(() => {
    const cleanup = initScrollDepthTracking();
    return cleanup;
  }, [pathname]);
}
