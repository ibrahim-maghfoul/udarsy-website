"use client";

import { useEffect, useRef } from "react";
import "./articles-guides.css";

/* ── rounded-L clip-path (scholarship card) ────
   polygon() can't draw arcs and path() can't take % or calc(),
   so we measure the card and emit absolute-pixel arcs on resize.
   ─────────────────────────────────────────────── */
function useRoundedLClip(radius = 22, gap = 24) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const apply = () => {
      if (window.innerWidth <= 1024) {
        card.style.clipPath = "";
        return;
      }
      const r = radius;
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const ix = w / 2 + gap / 2;
      const iy = h / 2 - gap / 2;

      const d = [
        `M ${r},0`,
        `L ${w - r},0`,
        `A ${r},${r} 0 0 1 ${w},${r}`,
        `L ${w},${h - r}`,
        `A ${r},${r} 0 0 1 ${w - r},${h}`,
        `L ${ix + r},${h}`,
        `A ${r},${r} 0 0 1 ${ix},${h - r}`,
        `L ${ix},${iy + r}`,
        `A ${r},${r} 0 0 0 ${ix - r},${iy}`,
        `L ${r},${iy}`,
        `A ${r},${r} 0 0 1 0,${iy - r}`,
        `L 0,${r}`,
        `A ${r},${r} 0 0 1 ${r},0`,
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

export default function ArticlesGuides() {
  const scholarshipRef = useRoundedLClip();

  return (
    <section className="ag-section" aria-labelledby="ag-heading">
      <div className="ag-shell">
        <div className="ag-grid">
          <div className="ag-card ag-card--intro">1</div>
          <div className="ag-card ag-card--univ">2</div>
          <div ref={scholarshipRef} className="ag-card ag-card--scholarship">3</div>
          <div className="ag-card ag-card--cv">4</div>
          <div className="ag-card ag-card--abroad">5</div>
          <div className="ag-card ag-card--remote">6</div>
        </div>
      </div>
    </section>
  );
}