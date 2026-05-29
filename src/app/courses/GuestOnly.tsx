"use client";

import { useAuth } from "@/contexts/AuthContext";

// Wrapper that renders its children to guests and search crawlers only.
// Server-side render always emits the children (so Google sees the SEO content);
// on the client, once auth resolves, logged-in users get an empty render.
// During the initial hydration tick `loading` is true and we keep the children
// visible — that mirrors what crawlers see and prevents a layout shift on slow
// auth checks.
export default function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (!loading && user) return null;
  return <>{children}</>;
}