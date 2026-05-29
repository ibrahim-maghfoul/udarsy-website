import type { MetadataRoute } from "next";

// Bot policy:
//   ALLOW   → search engines + AI search + AI training that benefits the brand
//   BLOCK   → scrapers (SEO competitor tools, aggressive crawlers, data resellers)
// Cloudflare's "Managed robots.txt" must remain OFF or it overrides this file.

const ALLOWED_AI_BOTS = [
  // Search-engine-style AI bots that drive traffic and cite Udarsy
  "OAI-SearchBot",      // ChatGPT live web search
  "ChatGPT-User",       // ChatGPT user-triggered fetches
  "PerplexityBot",      // Perplexity live answers
  "Perplexity-User",    // Perplexity user-triggered fetches
  "ClaudeBot",          // Claude live search
  "Claude-User",        // Claude user-triggered fetches
  "DuckAssistBot",      // DuckDuckGo AI

  // Training bots — accepted because being in training data builds brand recall
  // when students/parents ask "best Moroccan BAC platform" in future model versions.
  "GPTBot",             // OpenAI training
  "Google-Extended",    // Gemini training
  "Anthropic-ai",       // Claude training (legacy UA)
  "Applebot-Extended",  // Apple Intelligence training — iPhone is huge in Morocco
  "meta-externalagent", // Meta AI training — WhatsApp/Instagram dominant in Morocco
  "cohere-ai",          // Cohere training
  "Gemini-ai",          // Gemini (alias)
  "CCBot",              // Common Crawl — widely used by legitimate AI research
];

const BLOCKED_SCRAPERS = [
  // Aggressive content scrapers with zero traffic benefit
  "Bytespider",         // ByteDance/TikTok — aggressive, no citations
  "PetalBot",           // Huawei — aggressive crawler
  "Amazonbot",          // Alexa data — no longer drives traffic

  // SEO competitor research tools — user does not use Ahrefs/Semrush themselves
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",            // Majestic
  "DotBot",             // Moz
  "BLEXBot",            // WebMeUp lead-gen
  "DataForSeoBot",      // SEO data reseller
  "SeznamBot",          // Czech search — irrelevant for Morocco
  "YandexBot",          // Russian search — irrelevant for Morocco
  "MauiBot",            // Generic scraper
  "Sogou",              // Chinese search — irrelevant for Morocco
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

  return {
    rules: [
      // Default rule for all crawlers not explicitly named below
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/profile",
          "/profile/",
          "/settings",
          "/onboarding",
          "/report",
          "/reset-password",
          "/verify-email",
          "/forgot-password",
          "/teacher/dashboard",
          "/instructor-dashboard",
          "/favorites/",
          "/design-test",
          "/design-lab",
          "/teacher/join/",
          "/lesson/*/preview",
        ],
      },

      // Explicitly allow good AI bots (some hosts strip the wildcard rule for named UAs)
      ...ALLOWED_AI_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),

      // Block scrapers entirely
      ...BLOCKED_SCRAPERS.map((ua) => ({ userAgent: ua, disallow: "/" })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}