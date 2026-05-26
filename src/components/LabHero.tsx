"use client";

import Link from "next/link";
import Image from "next/image";
import "../app/design-lab/hero.css";

const R2 = "https://files.udarsy.com/hero-cards";
const CARDS = [
  { src: `${R2}/anglais.webp`, title: "Anglais" },
  { src: `${R2}/arabe.webp`, title: "Arabe" },
  { src: `${R2}/mathematiques.webp`, title: "Mathématiques" },
  { src: `${R2}/physique.webp`, title: "Physique" },
  { src: `${R2}/sciences-de-la-vie-et-de-la-terre.webp`, title: "SVT" },
  { src: `${R2}/philosophie.webp`, title: "Philosophie" },
  { src: `${R2}/education-islamique.webp`, title: "Éducation Islamique" },
];

export function LabHero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <svg
        className="hero__curves"
        aria-hidden="true"
        viewBox="0 0 1600 940"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lab-curve-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3aaa6a" stopOpacity="0" />
            <stop offset="45%" stopColor="#3aaa6a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3aaa6a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lab-curve-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3aaa6a" stopOpacity="0" />
            <stop offset="55%" stopColor="#3aaa6a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3aaa6a" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d="M -120 40 Q 800 -160 1720 40" stroke="#3aaa6a" strokeOpacity="0.22" strokeWidth="1" fill="none" />
        <path d="M -120 120 Q 800 -40 1720 120" stroke="#3aaa6a" strokeOpacity="0.26" strokeWidth="1" fill="none" />
        <path d="M -120 60 C 400 240, 1200 -120, 1720 200" stroke="url(#lab-curve-a)" strokeWidth="1.1" fill="none" />
        <path d="M -120 260 Q 800 -80 1720 260" stroke="url(#lab-curve-a)" strokeWidth="1.3" fill="none" />
        <path d="M -120 180 Q 800 540 1720 180" stroke="#3aaa6a" strokeOpacity="0.22" strokeWidth="1" fill="none" />
        <path d="M -120 380 C 400 100, 1200 820, 1720 380" stroke="url(#lab-curve-b)" strokeWidth="1.2" fill="none" />
        <path d="M -120 470 Q 800 320 1720 470" stroke="#3aaa6a" strokeOpacity="0.30" strokeWidth="1.1" fill="none" />
        <path d="M -120 600 C 400 900, 1200 120, 1720 600" stroke="url(#lab-curve-a)" strokeWidth="1.1" fill="none" />
        <path d="M -120 120 C 400 700, 1200 700, 1720 120" stroke="#3aaa6a" strokeOpacity="0.20" strokeWidth="1" fill="none" />
        <path d="M -120 820 C 400 240, 1200 240, 1720 820" stroke="#3aaa6a" strokeOpacity="0.18" strokeWidth="1" fill="none" />
        <path d="M -120 700 Q 800 400 1720 700" stroke="#3aaa6a" strokeOpacity="0.22" strokeWidth="1" fill="none" />
        <path d="M -120 820 Q 800 1040 1720 820" stroke="url(#lab-curve-b)" strokeWidth="1.1" fill="none" />

        <ellipse cx="160" cy="200" rx="220" ry="220" stroke="#3aaa6a" strokeOpacity="0.18" strokeWidth="1" fill="none" />
        <ellipse cx="1460" cy="780" rx="260" ry="260" stroke="#3aaa6a" strokeOpacity="0.18" strokeWidth="1" fill="none" />

        <circle cx="1180" cy="140" r="6" fill="#3aaa6a" fillOpacity="0.3" />
        <circle cx="140" cy="540" r="4" fill="#3aaa6a" fillOpacity="0.35" />
        <circle cx="1380" cy="320" r="5" fill="#3aaa6a" fillOpacity="0.25" />
        <circle cx="320" cy="820" r="4" fill="#3aaa6a" fillOpacity="0.3" />
      </svg>

      <div className="hero__blob hero__blob--a" aria-hidden="true" />

      <div className="hero__inner">
        <h1 id="hero-heading" className="hero__headline">
          <span>Learn</span>
          <span className="hero__headline-accent">Smarter</span>
          <span>Together</span>
        </h1>

        <p className="hero__lead">
          AI-powered learning platform for Moroccan students. Structured courses,
          personalised progress, BAC highschool elementary and secondary school.
        </p>

        <div className="hero__ctas">
          <Link href="/courses" className="hero__cta hero__cta--primary">
            Start learning
          </Link>
        </div>
      </div>

      <div className="hero__deck" aria-hidden="true">
        {CARDS.map((card, i) => (
          <div className={`deck-card deck-card--${i}`} key={card.src}>
            <span className="deck-card__title">{card.title}</span>
            <Image
              src={card.src}
              alt=""
              width={971}
              height={1619}
              priority={i === 2 || i === 3}
              className="deck-card__img"
            />
          </div>
        ))}
      </div>
    </section>
  );
}