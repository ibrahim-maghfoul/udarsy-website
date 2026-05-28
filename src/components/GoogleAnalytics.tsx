'use client';

import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * GA4 (gtag.js) loaded only after first user interaction or 4 s idle —
 * whichever comes first. Visitors who bounce in <4s don't represent real
 * sessions, so we don't lose meaningful analytics, but we strip GA from the
 * INP/FCP measurement window. Page-view tracking lives in useAnalytics().
 */
export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return;
    if ((window as any).__gaLoaded) return;

    let fired = false;
    const load = () => {
      if (fired) return;
      fired = true;
      (window as any).__gaLoaded = true;
      cleanup();

      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() { w.dataLayer.push(arguments); };
      w.gtag('js', new Date());
      w.gtag('config', GA_ID, { page_path: window.location.pathname, send_page_view: false });

      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    };

    const events: (keyof WindowEventMap)[] = ['scroll', 'pointerdown', 'keydown', 'touchstart'];
    const opts = { once: true, passive: true } as AddEventListenerOptions;
    events.forEach(e => window.addEventListener(e, load, opts));
    const timer = window.setTimeout(load, 4000);
    function cleanup() {
      events.forEach(e => window.removeEventListener(e, load, opts));
      window.clearTimeout(timer);
    }
    return cleanup;
  }, []);

  return null;
}