'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Injects the Google Analytics 4 gtag.js script.
 * Place this once inside <head> in layout.tsx.
 * Page-view tracking is handled by useAnalytics() hook, not here.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
