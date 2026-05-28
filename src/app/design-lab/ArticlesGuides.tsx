"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./articles-guides.css";

/* ── rounded-L clip-path (scholarship card) ────
   polygon() can't draw arcs and path() can't take % or calc(),
   so we measure the card and emit absolute-pixel arcs on resize.
   ─────────────────────────────────────────────── */
function useRoundedLClip(radius = 22, gap = 24) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const apply = () => {
      // tablet/mobile: let CSS take over (clip-path: none)
      if (window.innerWidth <= 1024) {
        card.style.clipPath = "";
        return;
      }
      const r = radius;
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const ix = w / 2 + gap / 2; // inner corner X — at C4's left edge
      const iy = h / 2 - gap / 2; // inner corner Y — at R3's bottom edge

      const d = [
        `M ${r},0`,
        `L ${w - r},0`,
        `A ${r},${r} 0 0 1 ${w},${r}`,                    // TR convex
        `L ${w},${h - r}`,
        `A ${r},${r} 0 0 1 ${w - r},${h}`,                // BR convex
        `L ${ix + r},${h}`,
        `A ${r},${r} 0 0 1 ${ix},${h - r}`,               // bottom-left of vertical leg (convex)
        `L ${ix},${iy + r}`,
        `A ${r},${r} 0 0 0 ${ix - r},${iy}`,              // INNER concave corner of L
        `L ${r},${iy}`,
        `A ${r},${r} 0 0 1 0,${iy - r}`,                  // bottom-left of horizontal bar (convex)
        `L 0,${r}`,
        `A ${r},${r} 0 0 1 ${r},0`,                       // TL convex
        "Z",
      ].join(" ");

      card.style.clipPath = `path('${d}')`;
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(card);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [radius, gap]);

  return ref;
}

/* ── tiny shared icons ───────────────────────── */
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── soft-green illustration palette ─────────── */
const G_LINE = "#3aaa6a";
const G_FILL = "rgba(58, 170, 106, 0.16)";
const G_FILL_STRONG = "rgba(58, 170, 106, 0.28)";
const G_DARK = "#2c8a55";

/* ── intro card illustration ─────────────────── */
function IlloIntro() {
  return (
    <svg className="ag-intro-illo" viewBox="0 0 150 110" fill="none" aria-hidden="true">
      {/* coffee cup */}
      <path d="M10 78h36v10a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V78z" fill={G_FILL} stroke={G_LINE} strokeWidth="1.5" />
      <path d="M46 82h6a6 6 0 0 1 0 12h-6" stroke={G_LINE} strokeWidth="1.5" />
      <path d="M18 74c0-4 4-6 4-10s-4-6-4-10M30 74c0-4 4-6 4-10s-4-6-4-10" stroke={G_LINE} strokeWidth="1.3" strokeLinecap="round" />
      {/* notebook */}
      <rect x="60" y="58" width="42" height="38" rx="3" fill="#fff" stroke={G_LINE} strokeWidth="1.5" />
      <path d="M68 58v38" stroke={G_LINE} strokeWidth="1.2" />
      <path d="M74 68h22M74 76h22M74 84h16" stroke={G_LINE} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* plant pot */}
      <path d="M118 80h22l-3 16h-16z" fill={G_FILL} stroke={G_LINE} strokeWidth="1.5" />
      <path d="M129 80c0-10-6-16-12-18 4 6 4 12 12 18z" fill={G_FILL_STRONG} stroke={G_LINE} strokeWidth="1.3" />
      <path d="M129 80c0-12 6-20 14-22-4 8-4 14-14 22z" fill={G_FILL_STRONG} stroke={G_LINE} strokeWidth="1.3" />
      <path d="M129 80v-14" stroke={G_LINE} strokeWidth="1.2" />
    </svg>
  );
}

/* ── universities abroad ─────────────────────── */
function IlloUniversity() {
  return (
    <svg className="ag-illo" viewBox="0 0 130 130" fill="none" aria-hidden="true">
      {/* building */}
      <rect x="58" y="50" width="62" height="60" fill="#fff" stroke={G_LINE} strokeWidth="1.5" />
      <path d="M50 50l39-18 39 18" fill={G_FILL} stroke={G_LINE} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="68" y="62" width="10" height="14" stroke={G_LINE} strokeWidth="1.2" fill="#fff" />
      <rect x="84" y="62" width="10" height="14" stroke={G_LINE} strokeWidth="1.2" fill="#fff" />
      <rect x="100" y="62" width="10" height="14" stroke={G_LINE} strokeWidth="1.2" fill="#fff" />
      <rect x="82" y="86" width="14" height="24" fill={G_FILL} stroke={G_LINE} strokeWidth="1.2" />
      {/* checklist */}
      <rect x="6" y="40" width="42" height="56" rx="3" fill="#fff" stroke={G_LINE} strokeWidth="1.5" />
      <rect x="18" y="36" width="18" height="8" rx="2" fill={G_FILL_STRONG} stroke={G_LINE} strokeWidth="1.2" />
      <path d="M12 56l4 4 6-8M12 70l4 4 6-8M12 84l4 4 6-8" stroke={G_DARK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 58h16M28 72h16M28 86h12" stroke={G_LINE} strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
      {/* graduation cap */}
      <path d="M20 14l24-8 24 8-24 8z" fill={G_DARK} />
      <path d="M44 22v8c0 4 8 6 14 4" stroke={G_LINE} strokeWidth="1.4" fill="none" />
      <circle cx="58" cy="34" r="2" fill={G_LINE} />
      <path d="M68 14v8" stroke={G_LINE} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ── CV / resume ─────────────────────────────── */
function IlloCV() {
  return (
    <svg className="ag-illo" viewBox="0 0 130 130" fill="none" aria-hidden="true">
      {/* clipboard */}
      <rect x="22" y="14" width="80" height="100" rx="4" fill="#fff" stroke={G_LINE} strokeWidth="1.5" />
      <rect x="46" y="8" width="32" height="14" rx="3" fill={G_FILL_STRONG} stroke={G_LINE} strokeWidth="1.3" />
      {/* avatar */}
      <circle cx="42" cy="40" r="9" fill={G_FILL} stroke={G_LINE} strokeWidth="1.4" />
      <path d="M32 56c2-6 6-9 10-9s8 3 10 9" stroke={G_LINE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* name + lines */}
      <rect x="58" y="34" width="36" height="5" rx="1.5" fill={G_DARK} />
      <rect x="58" y="44" width="28" height="3" rx="1.5" fill={G_FILL_STRONG} />
      <path d="M32 70h66M32 78h66M32 86h54M32 94h60M32 102h40" stroke={G_LINE} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      {/* pen */}
      <path d="M96 96l14 14M96 96l-4 12 12-4z" stroke={G_LINE} strokeWidth="1.4" fill={G_FILL} strokeLinejoin="round" />
    </svg>
  );
}

/* ── scholarship feature ─────────────────────── */
function IlloScholarship() {
  /* purple-tinted palette local to this illustration */
  const P_LINE = "#5a3fc4";
  const P_SOFT = "rgba(167, 139, 250, 0.22)";
  const P_GLASS = "rgba(167, 139, 250, 0.16)";
  const P_SPARK = "#a78bfa";
  const COIN = "#e0b659";
  const COIN_LINE = "#a07a2c";
  const BOOK_GREEN = "#3aaa6a";
  const BOOK_GREEN_SOFT = "rgba(58, 170, 106, 0.55)";

  return (
    <svg className="ag-illo" viewBox="0 0 300 340" fill="none" aria-hidden="true">
      {/* ── floating sparkles ───────────────── */}
      <g fill={P_SPARK} opacity="0.75">
        <path d="M30 40 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
        <path d="M260 30 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" />
        <path d="M210 90 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" />
        <path d="M14 130 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1z" />
        <path d="M285 200 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" />
        <circle cx="50" cy="180" r="2.2" />
        <circle cx="248" cy="150" r="1.8" />
        <circle cx="20" cy="260" r="2" />
      </g>

      {/* ── stack of 4 books (bottom-back) ──── */}
      {/* book 1 — darkest, bottom */}
      <g>
        <rect x="78" y="232" width="170" height="26" rx="3" fill={BOOK_GREEN} />
        <rect x="78" y="232" width="6" height="26" fill="rgba(0,0,0,0.18)" />
        <path d="M100 240h130M100 250h110" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* book 2 — white cover, slightly offset */}
      <g>
        <rect x="64" y="208" width="178" height="26" rx="3" fill="#ffffff" stroke="#1b1d1c" strokeOpacity="0.85" strokeWidth="1.4" />
        <rect x="64" y="208" width="6" height="26" fill="rgba(0,0,0,0.08)" />
        <path d="M88 218h140M88 226h120" stroke="#1b1d1c" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* book 3 — soft green */}
      <g>
        <rect x="92" y="184" width="158" height="26" rx="3" fill={BOOK_GREEN_SOFT} />
        <rect x="92" y="184" width="6" height="26" fill="rgba(0,0,0,0.15)" />
        <path d="M114 192h120M114 202h100" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* book 4 — top, white */}
      <g>
        <rect x="106" y="162" width="134" height="24" rx="3" fill="#ffffff" stroke="#1b1d1c" strokeOpacity="0.85" strokeWidth="1.4" />
        <rect x="106" y="162" width="6" height="24" fill="rgba(0,0,0,0.08)" />
      </g>

      {/* ── graduation cap on top, slightly angled ── */}
      <g transform="rotate(-9 175 142)">
        {/* mortarboard */}
        <path d="M105 142 L175 116 L245 142 L175 168 Z" fill="#1b1d1c" />
        {/* cap base / band */}
        <ellipse cx="175" cy="168" rx="38" ry="10" fill="#1b1d1c" opacity="0.85" />
        <path d="M158 172 q 17 8 34 0 v 8 q -17 8 -34 0 z" fill="#1b1d1c" />
        {/* button on top */}
        <circle cx="175" cy="142" r="3.6" fill={P_SPARK} />
        {/* tassel cord */}
        <path d="M175 142 q 30 4 38 -14" stroke="#1b1d1c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* tassel */}
        <path d="M213 128 v 16" stroke="#1b1d1c" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M209 142 l4 8 4 -8" stroke="#1b1d1c" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </g>

      {/* ── scholarship fund jar (focal point) ── */}
      <g>
        {/* shadow under jar */}
        <ellipse cx="55" cy="312" rx="44" ry="4" fill="rgba(40, 20, 80, 0.18)" />
        {/* jar body */}
        <path
          d="M18 188 q 0 -6 6 -6 h 62 q 6 0 6 6 v 110 q 0 12 -12 12 h -50 q -12 0 -12 -12 z"
          fill={P_GLASS}
          stroke={P_LINE}
          strokeWidth="1.8"
        />
        {/* jar highlight */}
        <path d="M28 200 v 90" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />
        {/* jar lid */}
        <rect x="14" y="176" width="82" height="12" rx="3" fill={P_SOFT} stroke={P_LINE} strokeWidth="1.8" />
        <rect x="20" y="172" width="70" height="6" rx="2" fill={P_LINE} opacity="0.9" />
        {/* coins inside */}
        <g>
          <ellipse cx="38" cy="280" rx="9" ry="3.2" fill={COIN_LINE} opacity="0.45" />
          <circle cx="38" cy="276" r="9" fill={COIN} stroke={COIN_LINE} strokeWidth="1.2" />
          <path d="M34 276h8" stroke={COIN_LINE} strokeWidth="1" />
          <circle cx="62" cy="284" r="8" fill={COIN} stroke={COIN_LINE} strokeWidth="1.2" />
          <path d="M58 284h8" stroke={COIN_LINE} strokeWidth="1" />
          <circle cx="78" cy="274" r="7" fill={COIN} stroke={COIN_LINE} strokeWidth="1.2" />
          <path d="M75 274h6" stroke={COIN_LINE} strokeWidth="1" />
          <circle cx="50" cy="260" r="6.5" fill={COIN} stroke={COIN_LINE} strokeWidth="1.2" />
          <path d="M47 260h6" stroke={COIN_LINE} strokeWidth="1" />
          <circle cx="70" cy="252" r="5" fill={COIN} stroke={COIN_LINE} strokeWidth="1.1" />
        </g>
        {/* white label wrapped around jar */}
        <rect x="10" y="216" width="92" height="32" fill="#ffffff" stroke={P_LINE} strokeWidth="1.4" />
        <text
          x="56"
          y="230"
          fontSize="9"
          fontWeight="800"
          textAnchor="middle"
          fill={P_LINE}
          style={{ letterSpacing: "0.06em" }}
        >
          SCHOLARSHIP
        </text>
        <text
          x="56"
          y="242"
          fontSize="9"
          fontWeight="800"
          textAnchor="middle"
          fill={P_LINE}
          style={{ letterSpacing: "0.12em" }}
        >
          FUND
        </text>
        {/* coin dropping in */}
        <circle cx="56" cy="158" r="6" fill={COIN} stroke={COIN_LINE} strokeWidth="1.2" />
        <path d="M53 158h6" stroke={COIN_LINE} strokeWidth="1" />
      </g>

      {/* ── diploma scroll at base ─────────── */}
      <g transform="translate(130, 296) rotate(-4)">
        {/* shadow */}
        <ellipse cx="60" cy="22" rx="60" ry="3" fill="rgba(40, 20, 80, 0.15)" />
        {/* scroll body */}
        <rect x="6" y="2" width="108" height="18" rx="3" fill="#ffffff" stroke={P_LINE} strokeWidth="1.4" />
        <path d="M22 8h78M22 14h64" stroke={P_LINE} strokeOpacity="0.45" strokeWidth="1.1" strokeLinecap="round" />
        {/* scroll ends */}
        <ellipse cx="6" cy="11" rx="5" ry="10" fill={P_SOFT} stroke={P_LINE} strokeWidth="1.4" />
        <ellipse cx="114" cy="11" rx="5" ry="10" fill={P_SOFT} stroke={P_LINE} strokeWidth="1.4" />
        {/* ribbon */}
        <g transform="translate(56, 8)">
          <circle cx="0" cy="0" r="5" fill={P_SPARK} stroke={P_LINE} strokeWidth="1.2" />
          <path d="M-4 4 L-8 14 L-2 11 Z" fill={P_SPARK} />
          <path d="M4 4 L8 14 L2 11 Z" fill={P_SPARK} />
        </g>
      </g>
    </svg>
  );
}

/* ── studying abroad ─────────────────────────── */
function IlloAbroad() {
  return (
    <svg className="ag-illo" viewBox="0 0 175 175" fill="none" aria-hidden="true">
      {/* suitcase */}
      <rect x="14" y="76" width="100" height="80" rx="6" fill={G_FILL} stroke={G_LINE} strokeWidth="1.6" />
      <path d="M50 76v-12h28v12" stroke={G_LINE} strokeWidth="1.6" fill="none" />
      <path d="M14 110h100" stroke={G_LINE} strokeWidth="1.4" />
      <rect x="58" y="102" width="12" height="16" rx="2" fill={G_DARK} />
      <path d="M30 130h12M52 130h12M76 130h16" stroke={G_LINE} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      {/* passport */}
      <rect x="100" y="32" width="60" height="78" rx="5" fill={G_DARK} />
      <rect x="100" y="32" width="60" height="78" rx="5" stroke={G_LINE} strokeWidth="1.4" fill="none" />
      <circle cx="130" cy="60" r="9" fill="#fff" />
      <path d="M121 60a9 9 0 0 0 18 0" stroke={G_DARK} strokeWidth="1.4" fill="none" />
      <path d="M112 84h36M116 92h28" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
      {/* airplane */}
      <path d="M120 142l30-10-4 8 8 4-34 8-4-4z" fill={G_FILL_STRONG} stroke={G_LINE} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

/* ── remote jobs ─────────────────────────────── */
function IlloRemote() {
  return (
    <svg className="ag-illo" viewBox="0 0 180 110" fill="none" aria-hidden="true">
      {/* desk surface */}
      <path d="M10 96h160" stroke={G_LINE} strokeWidth="1.4" />
      {/* laptop */}
      <rect x="40" y="22" width="100" height="64" rx="4" fill="#fff" stroke={G_LINE} strokeWidth="1.5" />
      <rect x="46" y="28" width="88" height="52" rx="2" fill={G_FILL} />
      {/* screen content: job search results */}
      <rect x="52" y="34" width="56" height="6" rx="1.5" fill={G_DARK} />
      <rect x="112" y="34" width="16" height="6" rx="1.5" fill={G_LINE} opacity="0.4" />
      <rect x="52" y="46" width="76" height="4" rx="1.5" fill="#fff" />
      <rect x="52" y="54" width="76" height="4" rx="1.5" fill="#fff" />
      <rect x="52" y="62" width="54" height="4" rx="1.5" fill="#fff" />
      <rect x="52" y="70" width="40" height="6" rx="2" fill={G_DARK} />
      {/* laptop base */}
      <path d="M30 86h120l6 8H24z" fill={G_FILL_STRONG} stroke={G_LINE} strokeWidth="1.4" strokeLinejoin="round" />
      {/* plant */}
      <path d="M150 96h22l-3 -16h-16z" fill={G_FILL} stroke={G_LINE} strokeWidth="1.4" />
      <path d="M161 80c0-10-5-16-10-18 3 6 3 12 10 18z" fill={G_FILL_STRONG} stroke={G_LINE} strokeWidth="1.2" />
      <path d="M161 80c0-12 6-18 12-20-3 8-3 12-12 20z" fill={G_FILL_STRONG} stroke={G_LINE} strokeWidth="1.2" />
      {/* coffee mug */}
      <rect x="6" y="74" width="22" height="20" rx="3" fill="#fff" stroke={G_LINE} strokeWidth="1.4" />
      <path d="M28 78h4a4 4 0 0 1 0 8h-4" stroke={G_LINE} strokeWidth="1.4" fill="none" />
      <path d="M12 68c0-3 3-4 3-7s-3-4-3-7M20 68c0-3 3-4 3-7s-3-4-3-7" stroke={G_LINE} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ── article meta block ──────────────────────── */
function Meta({ time }: { time: string }) {
  return (
    <span className="ag-meta">
      <ClockIcon />
      {time} min read
    </span>
  );
}

/* ── main section ────────────────────────────── */
export default function ArticlesGuides() {
  const scholarshipRef = useRoundedLClip();

  return (
    <section className="ag-section" aria-labelledby="ag-heading">
      <div className="ag-shell">
        <div className="ag-grid">

          {/* ── intro anchor ─────────────────── */}
          <div className="ag-card ag-card--intro">
            <span className="ag-pill">Articles &amp; Guides</span>
            <h2 id="ag-heading" className="ag-intro-headline">
              Guides for <span className="ag-accent">What&rsquo;s Next</span>
            </h2>
            <p className="ag-intro-copy">
              Practical, calm walkthroughs for applying to schools, landing
              your first job, and finding scholarships that fit you.
            </p>
            <Link href="/blog" className="ag-btn">
              View all articles
              <ArrowIcon />
            </Link>
            <IlloIntro />
          </div>

          {/* ── C · universities abroad ──────── */}
          <Link href="/blog" className="ag-card ag-card--univ">
            <span className="ag-pill">Applications</span>
            <h3 className="ag-title">How to Apply to Universities Abroad</h3>
            <Meta time="8" />
            <IlloUniversity />
          </Link>

          {/* ── D · scholarship L-shape ──────── */}
          <Link ref={scholarshipRef} href="/blog" className="ag-card ag-card--scholarship">
            <span className="ag-pill">Scholarships</span>
            <h3 className="ag-title">Top Scholarships for International Students in 2024</h3>
            <Meta time="5" />
            <IlloScholarship />
          </Link>

          {/* ── E · CV ───────────────────────── */}
          <Link href="/blog" className="ag-card ag-card--cv">
            <span className="ag-pill">Careers</span>
            <h3 className="ag-title">How to Write a CV That Gets You Hired</h3>
            <Meta time="6" />
            <IlloCV />
          </Link>

          {/* ── F · studying abroad ──────────── */}
          <Link href="/blog" className="ag-card ag-card--abroad">
            <span className="ag-pill">Abroad</span>
            <h3 className="ag-title">A First-Timer&rsquo;s Guide to Studying Abroad</h3>
            <Meta time="7" />
            <IlloAbroad />
          </Link>

          {/* ── B · wide remote jobs strip ───── */}
          <Link href="/blog" className="ag-card ag-card--remote">
            <div className="ag-remote-body">
              <span className="ag-pill">Careers</span>
              <h3 className="ag-title">Remote Jobs for Students: Where to Look and How to Land One</h3>
              <Meta time="9" />
            </div>
            <IlloRemote />
          </Link>

        </div>
      </div>
    </section>
  );
}