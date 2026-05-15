/**
 * analytics.ts — Udarsy Analytics Utility
 *
 * Wraps Google Analytics 4 (gtag) with typed helpers for:
 *  - Page view tracking
 *  - Custom event tracking (user actions, behavior)
 *  - Traffic source / referral capture
 *  - Backend-side event proxying (for accuracy — bypasses ad blockers)
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

// ─── Core ─────────────────────────────────────────────────────────────────────

/** Safe wrapper — no-ops if GA isn't loaded yet */
function gtag(...args: unknown[]): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

// ─── Page Views ───────────────────────────────────────────────────────────────

export interface PageViewParams {
  path: string;        // e.g. "/explore"
  title?: string;      // document.title
  locale?: string;     // "ar" | "fr" | "en"
  referrer?: string;   // document.referrer
}

/** Send a GA4 page_view hit */
export function trackPageView(params: PageViewParams): void {
  if (!GA_ID) return;
  gtag('event', 'page_view', {
    page_location: `${window.location.origin}${params.path}`,
    page_path: params.path,
    page_title: params.title ?? document.title,
    page_referrer: params.referrer ?? document.referrer,
    language: params.locale,
  });
}

// ─── Custom Events (User Actions & Behavior) ──────────────────────────────────

export type AnalyticsEventName =
  // Auth
  | 'login'
  | 'sign_up'
  | 'logout'
  // Content engagement
  | 'lesson_view'
  | 'lesson_complete'
  | 'resource_download'
  | 'video_play'
  | 'video_pause'
  | 'video_complete'
  // Search & explore
  | 'search'
  | 'filter_applied'
  | 'subject_selected'
  // Social
  | 'chat_message_sent'
  | 'contribution_submitted'
  | 'share'
  // Conversion
  | 'cta_click'
  | 'pricing_view'
  | 'apply_teacher_start'
  | 'apply_instructor_start'
  | 'newsletter_subscribe'
  | 'contact_form_submit'
  // Navigation behavior
  | 'outbound_link_click'
  | 'scroll_depth'
  | 'time_on_page';

export interface TrackEventParams {
  event: AnalyticsEventName;
  category?: string;   // e.g. "Content", "Auth", "Navigation"
  label?: string;      // descriptive label
  value?: number;      // numeric value (e.g. lesson progress %)
  [key: string]: unknown;
}

/** Send a custom GA4 event */
export function trackEvent({ event, category, label, value, ...rest }: TrackEventParams): void {
  if (!GA_ID) return;
  gtag('event', event, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

// ─── Traffic Source / Referral Capture ────────────────────────────────────────

export interface TrafficSource {
  source: string;        // e.g. "google", "facebook", "direct"
  medium: string;        // e.g. "organic", "social", "email"
  campaign?: string;     // UTM campaign name
  content?: string;      // UTM content
  term?: string;         // UTM term (paid search)
  referrer?: string;     // raw referrer URL
  landingPage: string;   // first page user landed on
}

/**
 * Parse UTM parameters + referrer to identify traffic source.
 * Should be called on first page load (ideally in AuthContext or app layout).
 */
export function captureTrafficSource(): TrafficSource {
  const params = new URLSearchParams(window.location.search);

  const utmSource   = params.get('utm_source') ?? '';
  const utmMedium   = params.get('utm_medium') ?? '';
  const utmCampaign = params.get('utm_campaign') ?? '';
  const utmContent  = params.get('utm_content') ?? '';
  const utmTerm     = params.get('utm_term') ?? '';
  const referrer    = document.referrer;

  // Determine source/medium if no UTM params
  let source = utmSource;
  let medium = utmMedium;

  if (!source) {
    if (!referrer || referrer === '') {
      source = 'direct';
      medium = 'none';
    } else {
      const referrerHost = new URL(referrer).hostname.replace('www.', '');
      const organicEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'yandex', 'baidu'];
      const socialNetworks = ['facebook', 'instagram', 'twitter', 'x.com', 'linkedin', 'tiktok', 'youtube', 'snapchat', 'whatsapp'];

      if (organicEngines.some(e => referrerHost.includes(e))) {
        source = referrerHost;
        medium = 'organic';
      } else if (socialNetworks.some(s => referrerHost.includes(s))) {
        source = referrerHost;
        medium = 'social';
      } else {
        source = referrerHost;
        medium = 'referral';
      }
    }
  }

  const trafficData: TrafficSource = {
    source,
    medium,
    campaign: utmCampaign || undefined,
    content: utmContent || undefined,
    term: utmTerm || undefined,
    referrer: referrer || undefined,
    landingPage: window.location.pathname,
  };

  // Fire a GA4 campaign event so it appears in Traffic Sources report
  if (utmSource) {
    gtag('event', 'campaign_details', {
      campaign_id: utmCampaign,
      campaign: utmCampaign,
      source: utmSource,
      medium: utmMedium,
      term: utmTerm,
      content: utmContent,
    });
  }

  return trafficData;
}

// ─── Backend Proxy Event (bypasses ad blockers for accuracy) ──────────────────

export interface BackendEventPayload {
  name: string;              // GA4 event name
  params?: Record<string, unknown>;
  clientId?: string;         // GA client_id cookie value
}

/**
 * Send an event through your backend (Measurement Protocol).
 * Use this for critical conversion events (registration, purchase, etc.)
 * to ensure accuracy regardless of ad blockers.
 */
export async function trackServerEvent(payload: BackendEventPayload): Promise<void> {
  try {
    const clientId = getGAClientId();
    const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-App-Key': apiKey } : {}),
      },
      body: JSON.stringify({ ...payload, clientId }),
      keepalive: true,
    });
  } catch {
    // Analytics failures should never surface to users
  }
}

/** Read the GA4 client_id from the _ga cookie */
export function getGAClientId(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/_ga=GA\d+\.\d+\.(\d+\.\d+)/);
  return match ? match[1] : '';
}

// ─── Scroll Depth Tracking ────────────────────────────────────────────────────

/**
 * Track scroll depth milestones (25%, 50%, 75%, 100%).
 * Returns a cleanup function — call on component unmount.
 */
export function initScrollDepthTracking(): () => void {
  const milestones = [25, 50, 75, 100];
  const reached = new Set<number>();

  function onScroll() {
    const scrolled = window.scrollY + window.innerHeight;
    const total    = document.documentElement.scrollHeight;
    const pct      = Math.round((scrolled / total) * 100);

    for (const milestone of milestones) {
      if (pct >= milestone && !reached.has(milestone)) {
        reached.add(milestone);
        trackEvent({
          event: 'scroll_depth',
          category: 'Behavior',
          label: `${milestone}%`,
          value: milestone,
          page_path: window.location.pathname,
        });
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
