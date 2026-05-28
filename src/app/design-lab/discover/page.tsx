"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./discover.css";

type Category = {
  key: string;
  label: string;
  icon: string; // path under /public
};

const STROKE = "currentColor";

const CATEGORIES: Category[] = [
  { key: "maths",      label: "Maths",              icon: "/icons/Maths.webp" },
  { key: "pc",         label: "Physique-Chimie",    icon: "/icons/Physique-Chimie.webp" },
  { key: "svt",        label: "SVT",                icon: "/icons/sciences-de-la-vie-et-de-la-terre.webp" },
  { key: "francais",   label: "Français",           icon: "/icons/Fran%C3%A7ais.webp" },
  { key: "anglais",    label: "Anglais",            icon: "/icons/Anglais.webp" },
  { key: "arabe",      label: "Arabe",              icon: "/icons/Arabe.webp" },
  { key: "histgeo",    label: "Histoire-Géo",       icon: "/icons/Histoire-G%C3%A9o.webp" },
  { key: "philo",      label: "Philosophie",        icon: "/icons/Philosophie.webp" },
  { key: "islamique",  label: "Éducation Islamique", icon: "/icons/%C3%89ducation%20Islamique.webp" },
];

type Feature = {
  title: string;
  desc: string;
  icon: string;
};

const FEATURES: Feature[] = [
  {
    title: "Curriculum-aligned",
    desc: "Built around the Moroccan school program",
    icon: "/stats/Curriculum.webp",
  },
  {
    title: "AI tutoring",
    desc: "Explanations on demand, in your language",
    icon: "/stats/AI%20tutoring.webp",
  },
  {
    title: "Track progress",
    desc: "Streaks, milestones and clear insights",
    icon: "/stats/Track%20progress.webp",
  },
  {
    title: "Trusted community",
    desc: "Verified teachers, peers and mentors",
    icon: "/stats/Trusted%20community.webp",
  },
];

export default function DiscoverPage() {
  const [active, setActive] = useState<string>(CATEGORIES[0].key);
  const pillsWrapRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    ready: boolean;
  }>({ x: 0, y: 0, w: 0, h: 0, ready: false });

  const measure = () => {
    const idx = CATEGORIES.findIndex((c) => c.key === active);
    const node = pillRefs.current[idx];
    const wrap = pillsWrapRef.current;
    if (!node || !wrap) return;
    const nodeRect = node.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    setIndicator({
      x: nodeRect.left - wrapRect.left,
      y: nodeRect.top - wrapRect.top,
      w: nodeRect.width,
      h: nodeRect.height,
      ready: true,
    });
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // auto-cycle the indicator through every pill — pauses while the tab
  // is hidden so it doesn't drift in the background.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setActive((current) => {
        const idx = CATEGORIES.findIndex((c) => c.key === current);
        const next = CATEGORIES[(idx + 1) % CATEGORIES.length];
        return next.key;
      });
    }, 650);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="disc-root">
      {/* small floating lab chip — link back to the lab index */}
      <div className="lab-chip">
        <span className="lab-chip__label">Design Lab</span>
        <span className="lab-chip__sep" />
        <Link href="/design-lab" className="lab-chip__link">
          ← lab
        </Link>
      </div>

      <div className="disc-shell">
        {/* ── HERO ───────────────────────────────────────── */}
        <section className="disc-hero" aria-labelledby="disc-heading">
          {/* decorative vertical rail with diamonds + glowing dots */}
          <div className="disc-rail" aria-hidden="true">
            <span className="disc-rail__dot" />
            <span className="disc-rail__line" />
            <span className="disc-rail__diamond" />
            <span className="disc-rail__line" />
            <span className="disc-rail__dot" />
            <span className="disc-rail__line" />
            <span className="disc-rail__diamond" />
            <span className="disc-rail__line" />
            <span className="disc-rail__dot" />
          </div>

          <div className="disc-left">
            <span className="disc-badge">
              <svg
                className="disc-badge__star"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3l2.5 5.5L20 9.5l-4 4 1 5.5L12 16.5 7 19l1-5.5-4-4 5.5-1L12 3z" />
              </svg>
              The Udarsy Library
            </span>

            <h1 id="disc-heading" className="disc-headline">
              <span>Discover.</span>
              <span className="disc-headline__accent">Learn.</span>
              <span>Grow.</span>
            </h1>

            <p className="disc-lead">
              A calm, curated path through every subject of the Moroccan
              curriculum — built with AI tutoring, beautiful lessons and a
              community of teachers behind you.
            </p>
          </div>

          <div className="disc-right">
            <div className="disc-illu">
              <Image
                src="/Home%20page%20card/All%20subjects.webp?v=2"
                alt="A collage of academic subjects — books, globe, microscope and architecture"
                width={1200}
                height={1200}
                priority
              />
            </div>
          </div>
        </section>

        {/* ── CATEGORY PILLS ─────────────────────────────── */}
        <nav
          className="disc-pills-wrap"
          aria-label="Subject categories"
          ref={pillsWrapRef}
        >
          <span
            className={
              "disc-pill-indicator" +
              (indicator.ready ? " disc-pill-indicator--ready" : "")
            }
            aria-hidden="true"
            style={{
              transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0)`,
              width: `${indicator.w}px`,
              height: `${indicator.h}px`,
            }}
          />
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActive(cat.key)}
              ref={(el) => {
                pillRefs.current[i] = el;
              }}
              className={
                "disc-pill" + (active === cat.key ? " disc-pill--active" : "")
              }
              aria-pressed={active === cat.key}
            >
              <span className="disc-pill__icon-wrap" aria-hidden="true">
                <Image
                  src={cat.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="disc-pill__icon-img"
                />
              </span>
              {cat.label}
            </button>
          ))}
        </nav>

        {/* ── FEATURES GRID ───────────────────────────────── */}
        <section
          className="disc-grid"
          aria-label="Why students choose Udarsy"
        >
          {FEATURES.map((f, i) => (
            <article className="disc-card" key={f.title}>
              <span className="disc-card__index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="disc-card__icon-wrap" aria-hidden="true">
                <Image
                  src={f.icon}
                  alt=""
                  width={140}
                  height={140}
                  className="disc-card__icon-img"
                />
              </span>
              <div className="disc-card__text">
                <h3 className="disc-card__title">{f.title}</h3>
                <p className="disc-card__desc">{f.desc}</p>
              </div>
              <span className="disc-card__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </span>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
