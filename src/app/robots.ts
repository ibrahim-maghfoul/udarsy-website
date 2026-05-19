import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";
  return {
    rules: [
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
        ],
      },
      // AI crawlers — explicitly allow all public content
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Anthropic-ai", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "Gemini-ai", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
