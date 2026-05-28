"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import "./SubjectLibrarySection.css";

type FeatureRow = {
  key: "card1" | "card2" | "card3" | "card4";
  icon: string;
};

const FEATURES: FeatureRow[] = [
  { key: "card1", icon: "/stats/Curriculum.webp" },
  { key: "card2", icon: "/stats/AI%20tutoring.webp" },
  { key: "card3", icon: "/stats/Track%20progress.webp" },
  { key: "card4", icon: "/stats/Trusted%20community.webp" },
];

export function SubjectLibrarySection() {
  const t = useTranslations("SubjectCards");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const rootRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "-40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className={"sl-root" + (inView ? " is-in-view" : "")}
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={t("badge")}
    >
      <div className="sl-shell">
        <div className="sl-hero">
          <div className="sl-rail" aria-hidden="true">
            <span className="sl-rail__dot" />
            <span className="sl-rail__line" />
            <span className="sl-rail__diamond" />
            <span className="sl-rail__line" />
            <span className="sl-rail__dot" />
            <span className="sl-rail__line" />
            <span className="sl-rail__diamond" />
            <span className="sl-rail__line" />
            <span className="sl-rail__dot" />
          </div>

          <div className="sl-left">
            <span className="sl-badge">
              <svg
                className="sl-badge__star"
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
              {t("badge")}
            </span>

            <h2 className="sl-headline">
              <span>{t("headline_a")}</span>
              <span className="sl-headline__accent">{t("headline_b")}</span>
              <span>{t("headline_c")}</span>
            </h2>

            <p className="sl-lead">{t("lead")}</p>
          </div>

          <div className="sl-right">
            <div className="sl-illu">
              <Image
                src="/Home%20page%20card/All%20subjects.webp?v=2"
                alt=""
                width={1200}
                height={1200}
              />
            </div>
          </div>
        </div>

        <div className="sl-grid">
          {FEATURES.map((f, i) => (
            <article className="sl-card" key={f.key}>
              <span className="sl-card__index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sl-card__icon-wrap" aria-hidden="true">
                <svg className="sl-card__icon-trace" viewBox="0 0 100 100">
                  {/* Two half-arcs that meet at 3 o'clock so the stroke
                      unfurls in both directions at once. */}
                  <path className="sl-card__icon-trace__path" d="M 2,50 A 48,48 0 0,1 98,50" />
                  <path className="sl-card__icon-trace__path" d="M 2,50 A 48,48 0 0,0 98,50" />
                </svg>
                <Image
                  src={f.icon}
                  alt=""
                  width={140}
                  height={140}
                  className="sl-card__icon-img"
                />
              </span>
              <div className="sl-card__text">
                <h3 className="sl-card__title">{t(`${f.key}_title`)}</h3>
                <p className="sl-card__desc">{t(`${f.key}_desc`)}</p>
              </div>
              <span className="sl-card__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}