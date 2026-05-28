"use client";

import { usePathname } from "next/navigation";

/**
 * CSS-only page transition — fades + slides 12px on every pathname change.
 * Was framer-motion (~50KB gz) for the same effect on every route.
 * Drops the exit animation; the new page mounts immediately. Small UX trade
 * for big bundle win on landing page.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div key={pathname} className="page-transition">
            {children}
        </div>
    );
}
