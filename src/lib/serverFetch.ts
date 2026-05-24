/**
 * Authenticated server-side fetch for Next.js Server Components.
 *
 * Automatically attaches:
 *   - X-App-Key header (required by every /api route)
 *   - Content-Type: application/json
 *
 * Usage:
 *   const data = await serverFetch<MyType>('/news?limit=100', { revalidate: 60 });
 *   const data = await serverFetch('/news/123', { cache: 'no-store' });
 */

// BACKEND_URL is server-only (no NEXT_PUBLIC_ prefix) so it's read at runtime,
// not baked in at build time. Set it in production to the internal backend URL
// (e.g. http://localhost:5000 or internal IP) to bypass Cloudflare for SSR calls.
const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
// Prefer the server-only var (not inlined at build time) so next start always
// reads the live value from .env.local, falling back to the NEXT_PUBLIC_ version.
const APP_KEY  = process.env.APP_API_KEY || process.env.NEXT_PUBLIC_APP_API_KEY || '';

const BASE_HEADERS: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(APP_KEY ? { 'X-App-Key': APP_KEY } : {}),
};

type FetchOptions = {
    /** ISR revalidate in seconds. Pass `false` to opt out of caching. */
    revalidate?: number | false;
    /** Next.js cache mode — 'no-store' for always-fresh SSR. */
    cache?: RequestCache;
    /** Optional Bearer token for authenticated server-side requests. */
    token?: string;
};

export async function serverFetch<T = unknown>(
    path: string,
    options: FetchOptions = {}
): Promise<T | null> {
    const { revalidate, cache, token } = options;

    const headers: Record<string, string> = {
        ...BASE_HEADERS,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const nextOpts: Record<string, unknown> = {};
    if (revalidate !== undefined) nextOpts.revalidate = revalidate;

    const url = `${BACKEND}/api${path}`;
    try {
        const res = await fetch(url, {
            headers,
            ...(cache !== undefined ? { cache } : {}),
            ...(Object.keys(nextOpts).length > 0 ? { next: nextOpts } : {}),
        });

        if (!res.ok) {
            if (res.status !== 404) {
                console.error(`[serverFetch] ${res.status} ${res.statusText} — GET ${url}`);
            }
            return null;
        }

        return (await res.json()) as T;
    } catch (err) {
        console.error(`[serverFetch] Network error — GET ${url}:`, err);
        return null;
    }
}

/**
 * Headers to use in client-side raw fetch() calls that can't go through api.ts
 * (e.g. keepalive fire-and-forget requests in analytics / session tracking).
 */
export const CLIENT_API_HEADERS: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(APP_KEY ? { 'X-App-Key': APP_KEY } : {}),
};
