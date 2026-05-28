'use client';

import { useEffect } from 'react';

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Clarity instruments every DOM mutation — heavy on INP. We defer the script
 * tag injection until the user actually interacts (scroll, click, keydown) or
 * 6 s of idle, whichever comes first. This keeps it out of the critical path
 * for the Lighthouse measurement window.
 */
export function MicrosoftClarity() {
  useEffect(() => {
    if (!CLARITY_ID || typeof window === 'undefined') return;
    if ((window as any).__clarityLoaded) return;

    let fired = false;
    const load = () => {
      if (fired) return;
      fired = true;
      (window as any).__clarityLoaded = true;
      cleanup();
      (function (c: any, l: Document, a: string, r: string, i: string) {
        c[a] = c[a] || function (...args: any[]) { (c[a].q = c[a].q || []).push(args); };
        const t = l.createElement(r) as HTMLScriptElement;
        t.async = true;
        t.src = 'https://www.clarity.ms/tag/' + i;
        const y = l.getElementsByTagName(r)[0];
        y.parentNode?.insertBefore(t, y);
      })(window, document, 'clarity', 'script', CLARITY_ID);
    };

    const events: (keyof WindowEventMap)[] = ['scroll', 'pointerdown', 'keydown', 'touchstart'];
    const opts = { once: true, passive: true } as AddEventListenerOptions;
    events.forEach(e => window.addEventListener(e, load, opts));
    const timer = window.setTimeout(load, 6000);
    function cleanup() {
      events.forEach(e => window.removeEventListener(e, load, opts));
      window.clearTimeout(timer);
    }
    return cleanup;
  }, []);

  return null;
}