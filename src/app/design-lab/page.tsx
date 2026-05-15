"use client";

import Link from "next/link";
import { FuturisticHero } from "@/components/FuturisticHero";

export default function DesignLab() {
  return (
    <main style={{ background: '#071B12' }}>
      <div style={{
        position: 'fixed', top: 16, left: 16, zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderRadius: 12,
        background: 'rgba(7,27,18,0.82)',
        border: '1px solid rgba(58,170,106,0.18)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      }}>
        <div style={{ fontSize: 8.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(58,170,106,0.55)' }}>
          Design Lab
        </div>
        <div style={{ width: 1, height: 12, background: 'rgba(58,170,106,0.2)' }} />
        <Link href="/" style={{ fontSize: 10.5, color: 'rgba(58,170,106,0.40)', textDecoration: 'none' }}>
          ← site
        </Link>
      </div>
      <FuturisticHero />
    </main>
  );
}
