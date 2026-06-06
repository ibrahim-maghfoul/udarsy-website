// Server component — pure render, no client hooks. Lets the hero HTML +
// preload hints reach the browser in the initial SSR response without
// waiting for hydration.
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import "./LabHero.css";

const R2 = "https://files.udarsy.com/hero-cards";
const CARDS = [
  { src: `${R2}/anglais.webp`, key: "anglais" },
  { src: `${R2}/arabe.webp`, key: "arabe" },
  { src: `${R2}/mathematiques.webp`, key: "maths" },
  { src: `${R2}/physique.webp`, key: "physique" },
  { src: `${R2}/sciences-de-la-vie-et-de-la-terre.webp`, key: "svt" },
  { src: `${R2}/philosophie.webp`, key: "philo" },
  { src: `${R2}/education-islamique.webp`, key: "islamique" },
];

export async function LabHero() {
  const t = await getTranslations("LabHero");
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* Decorative background curves — half the path count of the original.
          contain+content-visibility lets the browser skip recompute work
          and removes this from the LCP candidate set. */}
      <svg
        className="hero__curves"
        aria-hidden="true"
        viewBox="0 0 1600 940"
        preserveAspectRatio="xMidYMid slice"
        style={{ contain: 'strict', contentVisibility: 'auto' }}
      >
        <defs>
          <linearGradient id="lab-curve-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3aaa6a" stopOpacity="0" />
            <stop offset="45%" stopColor="#3aaa6a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3aaa6a" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path className="hero__curve hero__curve--1" d="M -120 90 C 280 -60, 1180 280, 1720 80" stroke="#3aaa6a" strokeOpacity="0.22" strokeWidth="1" fill="none">
          <animate attributeName="d" dur="7s" repeatCount="indefinite" begin="-0.5s"
            values="M -120 90 C 280 -60, 1180 280, 1720 80;
                    M -120 110 C 360 240, 1080 -100, 1720 120;
                    M -120 70 C 220 80, 1320 200, 1720 60;
                    M -120 90 C 280 -60, 1180 280, 1720 80" />
        </path>
        <path className="hero__curve hero__curve--2" d="M -120 200 C 360 480, 1080 -180, 1720 220" stroke="url(#lab-curve-a)" strokeWidth="1.2" fill="none">
          <animate attributeName="d" dur="9s" repeatCount="indefinite" begin="-2s"
            values="M -120 200 C 360 480, 1080 -180, 1720 220;
                    M -120 170 C 240 -40, 1320 460, 1720 180;
                    M -120 220 C 480 240, 1100 60, 1720 240;
                    M -120 200 C 360 480, 1080 -180, 1720 220" />
        </path>
        <path className="hero__curve hero__curve--3" d="M -120 260 C 220 -40, 1320 520, 1720 300" stroke="#3aaa6a" strokeOpacity="0.28" strokeWidth="1" fill="none">
          <animate attributeName="d" dur="8s" repeatCount="indefinite" begin="-3.5s"
            values="M -120 260 C 220 -40, 1320 520, 1720 300;
                    M -120 290 C 380 540, 1080 0, 1720 270;
                    M -120 250 C 200 320, 1280 180, 1720 310;
                    M -120 260 C 220 -40, 1320 520, 1720 300" />
        </path>
        <path className="hero__curve hero__curve--4" d="M -120 410 C 460 720, 1140 60, 1720 360" stroke="url(#lab-curve-a)" strokeWidth="1.1" fill="none">
          <animate attributeName="d" dur="10s" repeatCount="indefinite" begin="-1.5s"
            values="M -120 410 C 460 720, 1140 60, 1720 360;
                    M -120 380 C 320 100, 1280 700, 1720 400;
                    M -120 420 C 540 480, 1080 220, 1720 350;
                    M -120 410 C 460 720, 1140 60, 1720 360" />
        </path>
        <path className="hero__curve hero__curve--5" d="M -120 470 C 420 280, 1180 660, 1720 470" stroke="#3aaa6a" strokeOpacity="0.30" strokeWidth="1.1" fill="none">
          <animate attributeName="d" dur="7.5s" repeatCount="indefinite" begin="-4s"
            values="M -120 470 C 420 280, 1180 660, 1720 470;
                    M -120 470 C 360 660, 1240 280, 1720 470;
                    M -120 470 C 480 320, 1140 620, 1720 470;
                    M -120 470 C 420 280, 1180 660, 1720 470" />
        </path>
        <path className="hero__curve hero__curve--6" d="M -120 560 C 480 720, 1180 400, 1720 560" stroke="url(#lab-curve-a)" strokeWidth="1.1" fill="none">
          <animate attributeName="d" dur="9.5s" repeatCount="indefinite" begin="-2.5s"
            values="M -120 560 C 480 720, 1180 400, 1720 560;
                    M -120 560 C 380 400, 1240 720, 1720 560;
                    M -120 560 C 540 760, 1080 380, 1720 560;
                    M -120 560 C 480 720, 1180 400, 1720 560" />
        </path>
        <path className="hero__curve hero__curve--7" d="M -120 660 C 400 880, 1200 280, 1720 660" stroke="#3aaa6a" strokeOpacity="0.24" strokeWidth="1.1" fill="none">
          <animate attributeName="d" dur="8.5s" repeatCount="indefinite" begin="-5s"
            values="M -120 660 C 400 880, 1200 280, 1720 660;
                    M -120 660 C 360 380, 1280 900, 1720 660;
                    M -120 660 C 520 880, 1100 320, 1720 660;
                    M -120 660 C 400 880, 1200 280, 1720 660" />
        </path>
        <path className="hero__curve hero__curve--8" d="M -120 760 C 380 920, 1220 580, 1720 760" stroke="url(#lab-curve-a)" strokeWidth="1" fill="none">
          <animate attributeName="d" dur="7s" repeatCount="indefinite" begin="-3s"
            values="M -120 760 C 380 920, 1220 580, 1720 760;
                    M -120 760 C 280 580, 1340 940, 1720 760;
                    M -120 760 C 460 920, 1140 540, 1720 760;
                    M -120 760 C 380 920, 1220 580, 1720 760" />
        </path>
        <path className="hero__curve hero__curve--9" d="M -120 860 C 400 1060, 1200 660, 1720 860" stroke="#3aaa6a" strokeOpacity="0.22" strokeWidth="1.1" fill="none">
          <animate attributeName="d" dur="10s" repeatCount="indefinite" begin="-6s"
            values="M -120 860 C 400 1060, 1200 660, 1720 860;
                    M -120 860 C 360 660, 1280 1080, 1720 860;
                    M -120 860 C 520 1040, 1100 700, 1720 860;
                    M -120 860 C 400 1060, 1200 660, 1720 860" />
        </path>

        <ellipse cx="1460" cy="780" rx="260" ry="260" stroke="#3aaa6a" strokeOpacity="0.18" strokeWidth="1" fill="none" />

        <circle cx="1180" cy="140" r="6" fill="#3aaa6a" fillOpacity="0.3" />
        <circle cx="140" cy="540" r="4" fill="#3aaa6a" fillOpacity="0.35" />
      </svg>

      <div className="hero__blob hero__blob--a" aria-hidden="true" />

      <div className="hero__inner">
        <h1 id="hero-heading" className="hero__headline">
          <span>{t("headline_1")}</span>
          <span className="hero__headline-accent">{t("headline_2")}</span>
          <span>{t("headline_3")}</span>
        </h1>

        <p className="hero__lead">{t("lead")}</p>

        <div className="hero__ctas">
          <Link href="/courses" className="hero__cta hero__cta--primary">
            {t("cta")}
          </Link>
        </div>
      </div>

      <div className="hero__deck" aria-hidden="true">
        {CARDS.map((card, i) => {
          // LCP candidate is the center focal card (deck-card--3, physique).
          // Inner trio (2,3,4) overlaps the focal area — keep them all eager+high
          // so the visible cluster paints in one frame. Outer pair stays eager
          // but low priority so they don't fight for bandwidth with the LCP.
          const isFocal = i === 3;
          const isInner = i >= 2 && i <= 4;
          return (
            <div className={`deck-card deck-card--${i}`} key={card.src}>
              <span className="deck-card__title">{t(`cards.${card.key}`)}</span>
              <Image
                src={card.src}
                alt=""
                width={400}
                height={667}
                sizes="(max-width: 540px) 130px, (max-width: 820px) 176px, (max-width: 1100px) 230px, 266px"
                priority={isFocal}
                fetchPriority={isInner ? "high" : "low"}
                className="deck-card__img"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}