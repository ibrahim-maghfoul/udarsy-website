"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

// ── Particles ─────────────────────────────────────────────────────────────────
// No filter:blur — blur forces per-frame rasterisation even on tiny dots.
// Depth effect achieved with opacity alone. Large "soft" dots use increased size.
const PARTICLES = [
  { id: 0, l: '7%', t: '11%', w: 2.5, op: 0.55, delay: 0, dur: 5.2, g: false },
  { id: 1, l: '91%', t: '9%', w: 1.5, op: 0.35, delay: 1.2, dur: 4.8, g: false },
  { id: 2, l: '19%', t: '27%', w: 1, op: 0.18, delay: 0.7, dur: 6.1, g: false },
  { id: 3, l: '72%', t: '16%', w: 3, op: 0.30, delay: 0.3, dur: 4.5, g: false },
  { id: 4, l: '44%', t: '6%', w: 1.5, op: 0.28, delay: 2.1, dur: 5.8, g: false },
  { id: 5, l: '62%', t: '81%', w: 2, op: 0.28, delay: 0.5, dur: 4.2, g: false },
  { id: 6, l: '86%', t: '54%', w: 2.5, op: 0.38, delay: 0.9, dur: 5.5, g: false },
  { id: 7, l: '14%', t: '56%', w: 1.5, op: 0.20, delay: 3.2, dur: 6.3, g: false },
  { id: 8, l: '49%', t: '19%', w: 1.5, op: 0.27, delay: 0.4, dur: 5.4, g: false },
  { id: 9, l: '5%', t: '79%', w: 2, op: 0.28, delay: 1.1, dur: 4.9, g: false },
  { id: 10, l: '67%', t: '33%', w: 2, op: 0.50, delay: 0.6, dur: 4.6, g: true },
  { id: 11, l: '40%', t: '61%', w: 1.5, op: 0.40, delay: 1.7, dur: 5.2, g: true },
  { id: 12, l: '81%', t: '27%', w: 2.5, op: 0.38, delay: 0.8, dur: 4.4, g: true },
  { id: 13, l: '57%', t: '8%', w: 12, op: 0.08, delay: 1.0, dur: 7.5, g: false },
  { id: 14, l: '75%', t: '49%', w: 16, op: 0.05, delay: 1.5, dur: 9.0, g: true },
];

// ── Eco cards ─────────────────────────────────────────────────────────────────
type Card = {
  id: string; title: string; lessons: string; progress: number;
  l?: string; r?: string; top: string;
  w: number; tilt: number; dur: number; delay: number; blur: number; op: number;
  avatars?: boolean; icon: string; zIndex: number;
};
// blur is now applied on a static inner wrapper, NOT the animated element.
// This allows the GPU to composite the transform without re-rasterising the blur each frame.
const ECO_CARDS: Card[] = [
  { id: 'arab', title: 'Langue Arabe', lessons: '92 leçons', progress: 68, l: '12%', top: '12%', w: 220, tilt: -4, dur: 6.0, delay: 0.2, blur: 0, op: 1.00, avatars: true, icon: 'أ', zIndex: 8 },
  { id: 'math', title: 'Mathématiques', lessons: '128 leçons', progress: 75, r: '5%', top: '4%', w: 190, tilt: 6, dur: 4.8, delay: 0.6, blur: 0, op: 0.92, icon: 'π', zIndex: 7 },
  { id: 'phys', title: 'Physique-Chimie', lessons: '85 leçons', progress: 42, l: '36%', top: '54%', w: 172, tilt: -3, dur: 5.5, delay: 1.2, blur: 0, op: 0.88, icon: '⚡', zIndex: 6 },
  { id: 'hist', title: 'Histoire-Géo', lessons: '76 leçons', progress: 31, r: '1%', top: '57%', w: 152, tilt: 8, dur: 7.0, delay: 0.4, blur: 2.5, op: 0.58, icon: '◎', zIndex: 5 },
  { id: 'svt', title: 'SVT', lessons: '94 leçons', progress: 55, l: '1%', top: '57%', w: 148, tilt: -7, dur: 5.8, delay: 1.8, blur: 3.0, op: 0.52, icon: '⚛', zIndex: 5 },
];

// ── Micro widgets — flat green SVG icons ─────────────────────────────────────
const WIDGET_ICONS: Record<string, React.ReactNode> = {
  a: ( // Graduation cap
    <svg viewBox="0 0 24 24" fill="#3AAA6A" xmlns="http://www.w3.org/2000/svg" style={{ width: '55%', height: '55%' }}>
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
    </svg>
  ),
  b: ( // Atom / science
    <svg viewBox="0 0 24 24" fill="none" stroke="#3AAA6A" strokeWidth="1.6" xmlns="http://www.w3.org/2000/svg" style={{ width: '55%', height: '55%' }}>
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2" fill="#3AAA6A" stroke="none" />
    </svg>
  ),
  c: ( // Open book
    <svg viewBox="0 0 24 24" fill="#3AAA6A" xmlns="http://www.w3.org/2000/svg" style={{ width: '55%', height: '55%' }}>
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C2.2 20.85 3.7 20.5 5.5 20.5c1.55 0 3.15.35 4.5 1 1.35-.65 2.95-1 4.5-1 1.55 0 3.15.35 4.5 1 .65.35 1.25.35 1.75 0 .3-.2.25-.45.25-.65V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.35-.35-2.8-.5-4.5-.5-1.55 0-3.15.35-4.5 1V8c1.35-.65 2.95-1 4.5-1 1.7 0 3.15.15 4.5.5v11z" />
    </svg>
  ),
  d: ( // Bar chart
    <svg viewBox="0 0 24 24" fill="#3AAA6A" xmlns="http://www.w3.org/2000/svg" style={{ width: '55%', height: '55%' }}>
      <path d="M5 9h-2v11h2V9zm4-5H7v16h2V4zm4 7h-2v9h2v-9zm4-4h-2v13h2V7zm4-3h-2v16h2V4z" />
    </svg>
  ),
};
const WIDGETS = [
  { id: 'a', r: '34%', top: '4%', sz: 36, delay: 0, dur: 5.5 },
  { id: 'b', l: '4%', top: '40%', sz: 32, delay: 0.8, dur: 6.2 },
  { id: 'c', r: '19%', top: '40%', sz: 30, delay: 1.5, dur: 4.8 },
  { id: 'd', l: '41%', top: '70%', sz: 28, delay: 0.5, dur: 7.0 },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { target: 10, fmt: (n: number) => `${n}K+`, label: 'Étudiants actifs' },
  { target: 40, fmt: (n: number) => `${n}K+`, label: 'Cours disponibles' },
  { target: 350, fmt: (n: number) => `${n}+`, label: 'Bourses & opportunités' },
  { target: 98, fmt: (n: number) => `${n}%`, label: 'Satisfaction étudiante' },
];
const STAT_TARGETS = STATS.map(s => s.target);

// ── Onboarding steps ──────────────────────────────────────────────────────────
const STEPS = [
  { icon: '📚', title: 'Explorez les cours', desc: 'Plus de 40 000 cours organisés par matière, niveau et filière. Du Brevet au BAC, tout est là.' },
  { icon: '📈', title: 'Suivez votre progression', desc: 'Stats personnalisées, recommandations IA et objectifs quotidiens pour rester motivé.' },
  { icon: '💬', title: 'Rejoignez la communauté', desc: "Des milliers d'étudiants marocains dans des salles de chat par matière et niveau." },
  { icon: '🏆', title: 'Réussissez vos examens', desc: 'Exercices ciblés, examens blancs corrigés et préparation intensive pour le BAC & Brevet.' },
];

// ── Single RAF drives all four stat counters ──────────────────────────────────
function useAllCountUps(active: boolean): number[] {
  // Initialize to final values so SSR/crawlers see correct stats, not "0K+"
  const [vals, setVals] = useState(STAT_TARGETS);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 1800, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVals(STAT_TARGETS.map(target => Math.round(ease * target)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return vals;
}

// ── StatCell ──────────────────────────────────────────────────────────────────
function StatCell({ s, val, last, delay, label, isMobile }: { s: typeof STATS[0]; val: number; last: boolean; delay: number; label: string; isMobile: boolean }) {
  const isAr = useLocale() === 'ar';
  const fHead = isAr ? "var(--font-cairo),'Cairo',sans-serif" : "var(--font-barlow-condensed),'Barlow Condensed',sans-serif";
  const fBody = isAr ? "var(--font-cairo),'Cairo',sans-serif" : "var(--font-instrument-sans),'Instrument Sans',sans-serif";
  return (
    <div style={{
      flex: 1,
      padding: isMobile ? '10px 6px' : '20px 16px',
      textAlign: 'center',
      borderRight: last ? 'none' : '1px solid rgba(255,255,255,0.055)',
    }}>
      <div className="dlh-stat-val" style={{ fontSize: isMobile ? 20 : 26, fontWeight: 900, color: '#fff', fontFamily: fHead, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4, animationDelay: `${delay}ms` }}>
        {s.fmt(val)}
      </div>
      <div style={{ fontSize: isMobile ? 9 : 10.5, color: 'rgba(255,255,255,0.38)', fontFamily: fBody }}>
        {label}
      </div>
    </div>
  );
}

// ── Onboarding dialog ─────────────────────────────────────────────────────────
function OnboardingDialog({ onClose }: { onClose: () => void }) {
  const t = useTranslations('FuturisticHero');
  const router = useRouter();
  const isAr = useLocale() === 'ar';
  const fHead = isAr ? "var(--font-cairo),'Cairo',sans-serif" : "var(--font-barlow-condensed),'Barlow Condensed',sans-serif";
  const fBody = isAr ? "var(--font-cairo),'Cairo',sans-serif" : "var(--font-instrument-sans),'Instrument Sans',sans-serif";

  const steps = [
    {
      icon: (
        <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
          <path d="M10 2C6.5 2 4 4 4 4v13s2.5-1.5 6-1.5S16 17 16 17V4s-2.5-2-6-2z" stroke="#68E39B" strokeWidth="1.4" strokeLinejoin="round" />
          <line x1="10" y1="2" x2="10" y2="15.5" stroke="#68E39B" strokeWidth="1.4" />
        </svg>
      ),
      title: t('step_1_title'),
      desc: t('step_1_desc'),
    },
    {
      icon: (
        <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
          <circle cx="10" cy="10" r="7.5" stroke="#68E39B" strokeWidth="1.4" />
          <path d="M10 6v4.5l3 1.5" stroke="#68E39B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t('step_2_title'),
      desc: t('step_2_desc'),
    },
    {
      icon: (
        <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
          <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-4 3V5a1 1 0 011-1z" stroke="#68E39B" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ),
      title: t('step_3_title'),
      desc: t('step_3_desc'),
    },
    {
      icon: (
        <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
          <path d="M10 2l2.1 5.6H18l-4.6 3.3 1.8 5.6L10 13.4l-5.2 3.1 1.8-5.6L2 7.6h5.9L10 2z" stroke="#68E39B" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ),
      title: t('step_4_title'),
      desc: t('step_4_desc'),
    },
  ];

  return (
    <div
      role="dialog" aria-modal="true"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        background: 'rgba(3,9,5,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        animation: 'hDialogBg 0.22s ease-out both',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'rgba(7,22,14,0.98)',
        border: '1px solid rgba(58,170,106,0.20)',
        borderTop: '1px solid rgba(58,170,106,0.36)',
        borderRadius: 20,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 32px 80px rgba(0,0,0,0.72)',
        animation: 'hDialogIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #3AAA6A 40%, #68E39B 60%, transparent)' }} />

        <div style={{ padding: '22px 24px 20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', fontFamily: fHead, letterSpacing: '-0.02em', marginBottom: 3 }}>
                {t('dialog_title')}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', fontFamily: fBody }}>
                {t('dialog_subtitle')}
              </div>
            </div>
            <button
              onClick={onClose} aria-label={t('dialog_close')}
              style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >×</button>
          </div>

          {/* Vertical step list */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                {/* Icon column with connector line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 34, flexShrink: 0 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(58,170,106,0.10)',
                    border: '1px solid rgba(58,170,106,0.24)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      width: 1, flexGrow: 1, minHeight: 14,
                      background: 'linear-gradient(to bottom, rgba(58,170,106,0.22), rgba(58,170,106,0.04))',
                      margin: '5px 0',
                    }} />
                  )}
                </div>
                {/* Text */}
                <div style={{ paddingBottom: i < steps.length - 1 ? 18 : 0, paddingTop: 6 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.88)', fontFamily: fBody, marginBottom: 4, lineHeight: 1.3 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontFamily: fBody, lineHeight: 1.65 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg viewBox="0 0 14 14" width="12" height="12" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#3AAA6A" strokeWidth="1.2" />
                <path d="M4.5 7l1.8 1.8L9.5 5.5" stroke="#3AAA6A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.30)', fontFamily: fBody }}>{t('dialog_free')}</span>
            </div>
            <button
              onClick={() => { onClose(); router.push('/courses'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 999,
                background: 'rgba(58,170,106,0.18)', border: '1px solid rgba(58,170,106,0.40)',
                color: '#68E39B', fontSize: 12, fontWeight: 700, fontFamily: fBody, cursor: 'pointer',
                transition: 'background 0.18s ease, border-color 0.18s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,170,106,0.28)'; e.currentTarget.style.borderColor = 'rgba(58,170,106,0.60)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(58,170,106,0.18)'; e.currentTarget.style.borderColor = 'rgba(58,170,106,0.40)'; }}
            >
              {t('dialog_start')}
              <svg viewBox="0 0 14 14" width="11" height="11" fill="none">
                <path d="M3 7h8M8 4.5L10.5 7 8 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Futuristic Hero ───────────────────────────────────────────────────────────
export function FuturisticHero() {
  const t = useTranslations('FuturisticHero');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const router = useRouter();
  const fHead = isAr ? "var(--font-cairo),'Cairo',sans-serif" : "var(--font-barlow-condensed),'Barlow Condensed',sans-serif";
  const fBody = isAr ? "var(--font-cairo),'Cairo',sans-serif" : "var(--font-instrument-sans),'Instrument Sans',sans-serif";

  const [demoOpen, setDemoOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const countVals = useAllCountUps(statsVisible);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // All keyframes + responsive rules are in globals.css — no runtime style injection.
  return (
    <>

      <section className="dlh" style={{
        position: 'relative', minHeight: '100vh', width: '100%',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        background: 'radial-gradient(ellipse at 62% 46%, #1A3A2A 0%, #0D2019 28%, #071B12 60%, #050E0B 100%)',
        contain: 'layout paint',
      }}>

        {/* Grain */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px', opacity: 0.5, mixBlendMode: 'overlay' as const,
        }} />

        {/* Glows */}
        <div aria-hidden style={{ position: 'absolute', width: '54vw', height: '66vh', right: '7%', top: '14%', background: 'radial-gradient(ellipse,rgba(58,170,106,0.15) 0%,rgba(26,90,52,0.06) 48%,transparent 70%)', animation: 'hGlow 8s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 }} />
        <div aria-hidden style={{ position: 'absolute', width: '26vw', height: '34vh', right: '24%', top: '22%', background: 'radial-gradient(ellipse,rgba(58,170,106,0.24) 0%,rgba(58,170,106,0.07) 50%,transparent 72%)', animation: 'hGlow 5.5s ease-in-out 1.5s infinite', pointerEvents: 'none', zIndex: 1 }} />

        {/* SVG arcs */}
        <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} viewBox="0 0 1440 920" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="ag1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(58,170,106,0)" /><stop offset="42%" stopColor="rgba(58,170,106,0.10)" /><stop offset="100%" stopColor="rgba(58,170,106,0)" />
            </linearGradient>
          </defs>
          <path d="M-100 620 Q480-60 1120 360 Q1440 560 1560 180" fill="none" stroke="url(#ag1)" strokeWidth="1.5" />
          <path d="M620-80 Q960 240 1500 580" fill="none" stroke="rgba(58,170,106,0.06)" strokeWidth="1" />
          <path d="M1380-60 C1180 220 1060 380 860 520 S580 740 480 960" fill="none" stroke="rgba(58,170,106,0.05)" strokeWidth="1" />
          <ellipse cx="930" cy="445" rx="345" ry="198" fill="none" stroke="rgba(58,170,106,0.05)" strokeWidth="1" transform="rotate(-18 930 445)" />
          <ellipse cx="860" cy="425" rx="178" ry="98" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" transform="rotate(-12 860 425)" />
        </svg>

        {/* Particles — transform-only animation, no blur filter */}
        {PARTICLES.map(p => (
          <div key={p.id} aria-hidden style={{
            position: 'absolute', left: p.l, top: p.t, width: p.w, height: p.w,
            borderRadius: '50%', background: p.g ? '#68E39B' : '#fff', opacity: p.op,
            animation: `hParticle ${p.dur}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none', zIndex: 2, willChange: 'transform',
          }} />
        ))}

        {/* ── Content row ── */}
        <div className="dlh-content" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'stretch', flex: 1, minHeight: '83vh' }}>

          {/* Left zone */}
          <div className="dlh-left" style={{
            width: '42%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            paddingTop: 'clamp(120px,13vh,180px)',
            paddingBottom: 'clamp(60px,7vh,110px)',
            paddingInlineStart: isAr ? 'clamp(96px,10vw,160px)' : 'clamp(72px,8vw,140px)',
            paddingInlineEnd: 'clamp(48px,5vw,80px)',
          }}>

            {/* Badge — solid bg avoids a backdrop-filter compositing layer */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '6px 15px 6px 10px', borderRadius: 999,
              background: 'rgba(8,22,14,0.72)', border: '1px solid rgba(58,170,106,0.32)',
              width: 'fit-content', marginBottom: 24,
              willChange: 'transform, opacity',
              animation: 'hFadeUp 0.7s ease-out 0.1s both, hBadge 4s ease-in-out 1s infinite',
            }}>
              <span aria-hidden style={{ display: 'flex', animation: 'hSparkle 2.8s ease-in-out infinite' }}>
                <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
                  <path d="M10 1.5L11.8 8.2L18.5 10L11.8 11.8L10 18.5L8.2 11.8L1.5 10L8.2 8.2Z" fill="#68E39B" opacity="0.9" />
                  <path d="M16 2L16.7 4.3L19 5L16.7 5.7L16 8L15.3 5.7L13 5L15.3 4.3Z" fill="#3AAA6A" opacity="0.65" />
                </svg>
              </span>
              <span style={{ fontSize: 11.5, fontWeight: 600, fontFamily: fBody, color: 'rgba(255,255,255,0.70)' }}>
                {t('badge')}
              </span>
            </div>

            {/* Headline — 3 lines */}
            <div className="dlh-headline" style={{ animation: 'hFadeUp 0.7s ease-out 0.25s both', marginBottom: 20, ...(isMobile && { width: '70vw', maxWidth: '70vw' }) }}>
              {([
                { text: t('headline_1'), grad: false },
                { text: t('headline_2'), grad: true },
                { text: t('headline_3'), grad: false },
              ] as const).map(({ text, grad }) => (
                <div key={text} style={{
                  display: 'block',
                  fontFamily: fHead, fontWeight: 900,
                  fontSize: isMobile ? '61px' : 'clamp(46px, 5.8vw, 82px)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.0,
                  paddingBottom: 2,
                  ...(grad ? {
                    background: 'linear-gradient(135deg,#3AAA6A 0%,#52C98A 42%,#68E39B 68%,#3AAA6A 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  } : {
                    color: '#fff', textShadow: '0 2px 28px rgba(0,0,0,0.25)',
                  }),
                }}>
                  {text}
                </div>
              ))}
            </div>

            {/* Subtitle */}
            <p style={{
              fontFamily: fBody,
              fontSize: 'clamp(11px, 0.82vw, 12.5px)',
              fontWeight: 400, lineHeight: 1.75,
              color: 'rgba(255,255,255,0.44)',
              maxWidth: 400, margin: '0 0 30px',
              animation: 'hFadeUp 0.7s ease-out 0.4s both',
            }}>
              {t('subtitle')}
            </p>

            {/* CTAs */}
            <div className="dlh-ctas" style={{
              display: 'flex', gap: 12, animation: 'hFadeUp 0.7s ease-out 0.55s both',
              ...(isMobile
                ? { flexDirection: 'column', alignItems: 'stretch', width: '70vw' }
                : { flexDirection: 'row', alignItems: 'center' }
              ),
            }}>
              <button
                className="dlh-cta-primary"
                onClick={() => router.push('/courses')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '12px 24px', borderRadius: 999,
                  background: 'rgba(58,170,106,0.28)', border: '1px solid rgba(58,170,106,0.52)',
                  color: '#fff', fontSize: 13.5, fontWeight: 700, fontFamily: fBody, cursor: 'pointer',
                  boxShadow: '0 4px 22px rgba(58,170,106,0.22)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  willChange: 'transform', whiteSpace: 'nowrap',
                  ...(isMobile && { width: '100%', height: '44px', boxSizing: 'border-box' as const }),
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(58,170,106,0.38)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 22px rgba(58,170,106,0.22)'; }}
              >
                {t('cta_start')}
                <svg viewBox="0 0 18 18" width="13" height="13" fill="none"><path d="M3.5 9h11M10 4.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>

              <div className="dlh-cta-demo" style={{
                display: 'flex', alignItems: 'center', gap: 9,
                ...(isMobile && {
                  justifyContent: 'center', height: '44px', boxSizing: 'border-box' as const,
                  borderRadius: 999, background: 'rgba(255,255,255,0.055)',
                  border: '1px solid rgba(255,255,255,0.18)', padding: '0 16px',
                }),
              }}>
                <button
                  onClick={() => setDemoOpen(true)}
                  aria-label={t('cta_demo')}
                  style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: isMobile ? 'transparent' : 'rgba(255,255,255,0.055)',
                    border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.2s ease', flexShrink: 0,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
                  onMouseLeave={e => (e.currentTarget.style.background = isMobile ? 'transparent' : 'rgba(255,255,255,0.055)')}
                >
                  <svg viewBox="0 0 18 18" width="12" height="12" fill="none"><path d="M6 4.5l8 4.5-8 4.5V4.5z" fill="rgba(255,255,255,0.82)" /></svg>
                </button>
                <button
                  onClick={() => setDemoOpen(true)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,0.38)', fontFamily: fBody, transition: 'color 0.18s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}
                >{t('cta_demo')}</button>
              </div>
            </div>
          </div>

          {/* Right zone — floating ecosystem */}
          <div className="dlh-right" style={{ flex: 1, position: 'relative', overflow: 'visible' }}>
            {/* Inner wrapper pushed down to clear navbar — cards/widgets are absolute inside this */}
            <div style={{ position: 'absolute', top: 'clamp(88px,11vh,130px)', right: 'clamp(40px,5vw,80px)', bottom: 0, left: 0 }}>

              {ECO_CARDS.map(card => (
                <div key={card.id} style={{ position: 'absolute', left: card.l, right: card.r, top: card.top, zIndex: card.zIndex }}>
                  <div style={{ transform: `rotate(${card.tilt}deg)`, opacity: card.op }}>
                    {/* Animate ONLY the transform — blur lives on a separate static wrapper
                      so the browser can composite the GPU layer without re-rasterising each frame */}
                    <div style={{
                      animation: `hCardIn 0.9s ease-out ${card.delay}s both, hFloat ${card.dur}s ease-in-out ${card.delay}s infinite`,
                      willChange: 'transform',
                    }}>
                      <div style={{ filter: card.blur > 0 ? `blur(${card.blur}px)` : undefined }}>
                        <div style={{ width: card.w, borderRadius: 18, background: 'rgba(255,255,255,0.057)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(58,170,106,0.22)', borderTop: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 14px 52px rgba(0,0,0,0.38),inset 0 1px 0 rgba(255,255,255,0.06)', overflow: 'hidden', padding: '13px 15px 15px' }}>
                          <div style={{ height: 2, borderRadius: 999, marginBottom: 11, background: 'linear-gradient(90deg,transparent,rgba(58,170,106,0.55) 50%,transparent)' }} />
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 800, fontFamily: fHead, color: 'rgba(255,255,255,0.90)' }}>{card.title}</div>
                            <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(58,170,106,0.15)', border: '1px solid rgba(58,170,106,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{card.icon}</div>
                          </div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontFamily: fBody, marginBottom: card.avatars ? 9 : 11 }}>{card.lessons}</div>
                          {card.avatars && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 11 }}>
                              <div style={{ display: 'flex' }}>
                                {[['#3AAA6A', 'S'], ['#4A9ECC', 'M'], ['#CC8A4A', 'A']].map(([c, l], i) => (
                                  <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: c, border: '1.5px solid rgba(8,22,14,0.65)', marginLeft: i > 0 ? -6 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: '#fff', fontFamily: fBody }}>{l}</div>
                                ))}
                              </div>
                              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.34)', fontFamily: fBody }}>2.4K {t('card_students')}</span>
                            </div>
                          )}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.26)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', fontFamily: fBody }}>{t('card_progress')}</span>
                              <span style={{ fontSize: 11, fontWeight: 800, color: '#68E39B', fontFamily: fHead }}>{card.progress}%</span>
                            </div>
                            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${card.progress}%`, background: 'linear-gradient(90deg,#3AAA6A,#68E39B)', borderRadius: 999, boxShadow: '0 0 8px rgba(58,170,106,0.55)', transformOrigin: '0 50%', animation: `hProgBar 1.3s cubic-bezier(0.34,1.2,0.64,1) ${card.delay + 0.5}s both` }} />
                            </div>
                          </div>
                        </div>
                      </div>{/* /static blur wrapper */}
                    </div>
                  </div>
                </div>
              ))}

              {WIDGETS.map(w => (
                <div key={w.id} style={{ position: 'absolute', left: (w as { l?: string }).l, right: (w as { r?: string }).r, top: w.top, zIndex: 4, animation: `hFloatSm ${w.dur}s ease-in-out ${w.delay}s infinite`, willChange: 'transform' }}>
                  <div style={{ width: w.sz, height: w.sz, borderRadius: '50%', background: 'rgba(8,22,14,0.78)', border: '1px solid rgba(58,170,106,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.28)' }}>
                    {WIDGET_ICONS[w.id]}
                  </div>
                </div>
              ))}
            </div>{/* /inner cards wrapper */}
          </div>
        </div>

        {/* ── Bottom arc + stats ── */}
        <div style={{ position: 'relative', zIndex: 15 }}>
          <svg aria-hidden viewBox="0 0 1440 140" preserveAspectRatio="none" style={{ width: '100%', height: 90, display: 'block', marginBottom: -3 }}>
            <defs>
              <linearGradient id="arcg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(58,170,106,0.07)" />
                <stop offset="100%" stopColor="rgba(5,14,11,0)" />
              </linearGradient>
            </defs>
            <path d="M-20 140 Q720-18 1460 140 L1460 140 L-20 140 Z" fill="url(#arcg)" />
            <path d="M-20 140 Q720-18 1460 140" fill="none" stroke="rgba(58,170,106,0.15)" strokeWidth="1" />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'center', padding: `0 clamp(20px,3vw,48px) 52px` }}>
            <div ref={statsRef} className={`dlh-stats${statsVisible ? ' dlh-stats-live' : ''}`} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
              background: 'rgba(255,255,255,0.042)',
              backdropFilter: isMobile ? 'none' : 'blur(28px)',
              WebkitBackdropFilter: isMobile ? 'none' : 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.07)', borderTop: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20, overflow: 'hidden',
              width: isMobile ? '75vw' : '100%',
              maxWidth: isMobile ? '75vw' : 820,
              margin: '0 auto',
              boxShadow: '0 -6px 36px rgba(0,0,0,0.22),0 24px 60px rgba(0,0,0,0.42)',
              ...(isMobile && { gridTemplateColumns: '1fr 1fr', borderRadius: 16 }),
            }}>
              {STATS.map((s, i) => {
                const labelKey = (['stat_students', 'stat_courses', 'stat_scholarships', 'stat_satisfaction'] as const)[i];
                return <StatCell key={i} s={s} val={countVals[i]} last={i === STATS.length - 1} delay={i * 80} label={t(labelKey)} isMobile={isMobile} />;
              })}
            </div>
          </div>
        </div>
      </section>

      {demoOpen && <OnboardingDialog onClose={() => setDemoOpen(false)} />}
    </>
  );
}
